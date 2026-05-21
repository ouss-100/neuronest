"use server";

import connectDB from "@/lib/mongodb";
import { Child } from "@/models/Child";
import { Assessment } from "@/models/Assessment";
import { Appointment } from "@/models/Appointment";
import Notification from "@/models/Notification";

/* =======================
   PARENT DASHBOARD
======================= */
export const getParentDashboardStats = async (parentId: string) => {
  try {
    await connectDB();
    
    const children = await Child.find({ parentId }).lean();
    const childrenCount = children.length;
    const childIds = children.map(c => c._id);
    
    const assessments = await Assessment.find({ childId: { $in: childIds } }).sort({ createdAt: -1 }).lean();
    const assessmentsCount = assessments.length;
    
    const latestScore = assessments.length > 0 ? assessments[0].score : 0;
    
    // Generate some dynamic notifications based on recent assessments or appointments
    const dynamicNotifications = [];
    if (assessments.length > 0) {
      dynamicNotifications.push({
        text: `New assessment completed with score ${assessments[0].score}%`,
        time: "Recently",
      });
    }
    const appointments = await Appointment.find({ parentId }).sort({ appointmentDate: -1 }).lean();
    if (appointments.length > 0) {
      dynamicNotifications.push({
        text: `Appointment ${appointments[0].status}`,
        time: "Recently",
      });
    }
    if (dynamicNotifications.length === 0) {
      dynamicNotifications.push({ text: "Welcome to Neuronest!", time: "Today" });
    }

    return {
      success: true,
      stats: {
        childrenCount,
        assessmentsCount,
        latestScore,
        children: JSON.parse(JSON.stringify(children)),
        notifications: dynamicNotifications,
        assessments: JSON.parse(JSON.stringify(assessments.slice(0, 5))),
        appointments: JSON.parse(JSON.stringify(appointments.slice(0, 3))),
      }
    };
  } catch (error: any) {
    console.error("Error fetching parent dashboard stats:", error);
    return { success: false, message: error.message };
  }
};

/* =======================
   DOCTOR DASHBOARD
======================= */
export const getDoctorDashboardStats = async (doctorId: string) => {
  try {
    await connectDB();
    
    const appointments = await Appointment.find({ doctorId })
      .populate("parentId", "firstname lastname")
      .populate("childId")
      .sort({ appointmentDate: 1 })
      .lean();
      
    const uniqueChildrenMap = new Map();
    let pendingReviews = 0;
    
    for (const appt of appointments) {
      if (appt.childId && !uniqueChildrenMap.has((appt.childId as any)._id.toString())) {
        uniqueChildrenMap.set((appt.childId as any)._id.toString(), {
          name: `Child (Age ${(appt.childId as any).age})`,
          age: (appt.childId as any).age,
          parent: `${(appt.parentId as any)?.firstname || ""} ${(appt.parentId as any)?.lastname || ""}`,
          status: appt.status === "completed" ? "completed" : "pending",
          concern: appt.reason || "General Checkup",
          lastSeen: new Date(appt.appointmentDate).toLocaleDateString(),
        });
      }
      if (appt.status === "pending") pendingReviews++;
    }
    
    const assignedChildrenCount = uniqueChildrenMap.size;
    const assignedChildren = Array.from(uniqueChildrenMap.values());
    
    const upcomingAppointments = appointments
      .filter(a => a.status === "confirmed" && new Date(a.appointmentDate) >= new Date())
      .slice(0, 3)
      .map(a => ({
        parent: `${(a.parentId as any)?.firstname || ""} ${(a.parentId as any)?.lastname || ""}`,
        child: `Age ${(a.childId as any)?.age || "?"}`,
        time: new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(a.appointmentDate).toLocaleDateString(),
        type: "Consultation"
      }));

    return {
      success: true,
      stats: {
        assignedChildrenCount,
        pendingReviews,
        appointmentsCount: upcomingAppointments.length,
        completedCount: appointments.filter(a => a.status === "completed").length,
        children: assignedChildren,
        upcomingAppointments,
        notifications: [
          { text: "Welcome to your dashboard", time: "Today", unread: false }
        ]
      }
    };
  } catch (error: any) {
    console.error("Error fetching doctor dashboard stats:", error);
    return { success: false, message: error.message };
  }
};
