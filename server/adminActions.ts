"use server";

import connectDB from "@/lib/mongodb";
import { Doctor } from "@/models/Doctor";
import { User } from "@/models/User";
import { Appointment } from "@/models/Appointment";
import { Rapport } from "@/models/Rapport";
import Notification from "@/models/Notification";
import Contact from "@/models/Contact";
import { Assessment } from "@/models/Assessment";

/* =======================
   GET ALL USERS
======================= */
export const getAllUsers = async () => {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    return { success: true, users: JSON.parse(JSON.stringify(users)) };

  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, message: "Failed to fetch users", users: [] };
  }
};

/* =======================
   GET PENDING DOCTORS
======================= */
export const getPendingDoctors = async () => {
  try {
    await connectDB();
    const doctors = await Doctor.find({ isActive: false }).sort({ createdAt: -1 });
    return { success: true, doctors: JSON.parse(JSON.stringify(doctors)) };
  } catch (error) {
    console.error("Error fetching pending doctors:", error);
    return { success: false, message: "Failed to fetch doctors", doctors: [] };
  }
};

/* =======================
   ACTIVATE DOCTOR
======================= */
export const activateDoctor = async (doctorId: string) => {
  try {
    await connectDB();
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { isActive: true },
      { new: true }
    );

    if (!doctor) {
      return { success: false, message: "Doctor not found" };
    }

    return {
      success: true,
      message: "Doctor activated successfully",
      doctor: JSON.parse(JSON.stringify(doctor))
    };
  } catch (error) {
    console.error("Error activating doctor:", error);
    return { success: false, message: "Failed to activate doctor" };
  }
};

/* =======================
   GET ADMIN DASHBOARD DATA
======================= */
export const getAdminDashboardData = async () => {
  try {
    await connectDB();

    const [
      totalUsers,
      totalDoctors,
      activeDoctors,
      totalParents,
      totalAppointments,
      appointmentsConfirmed,
      appointmentsPending,
      appointmentsCancelled,
      totalReports,
      recentNotifications
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "DOCTOR" }),
      Doctor.countDocuments({ isActive: true }),
      User.countDocuments({ role: "PARENT" }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "confirmed" }),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "cancelled" }),
      Rapport.countDocuments(),
      Notification.find({}).sort({ createdAt: -1 }).limit(5)
    ]);

    // Aggregate monthly registrations and assessments for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const [userGrowth, assessmentGrowth] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]),
      Assessment.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyGrowthRaw = [];
    const current = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;

      const uCount = userGrowth.find(g => g._id.year === year && g._id.month === monthNum)?.count || 0;
      const aCount = assessmentGrowth.find(g => g._id.year === year && g._id.month === monthNum)?.count || 0;

      monthlyGrowthRaw.push({
        month: monthNames[d.getMonth()],
        users: uCount,
        assessments: aCount,
      });
    }

    const maxCount = Math.max(
      ...monthlyGrowthRaw.map(m => m.users),
      ...monthlyGrowthRaw.map(m => m.assessments),
      1
    );

    const scaledGrowth = monthlyGrowthRaw.map(m => ({
      month: m.month,
      users: Math.round((m.users / maxCount) * 100),
      assessments: Math.round((m.assessments / maxCount) * 100),
      rawUsers: m.users,
      rawAssessments: m.assessments,
    }));

    const topAssessments = [
      { name: "Full Screening", count: totalReports > 0 ? Math.round(totalReports * 0.45) : 0, pct: totalReports > 0 ? 45 : 0 },
      { name: "Reading Assessment", count: totalReports > 0 ? Math.round(totalReports * 0.3) : 0, pct: totalReports > 0 ? 30 : 0 },
      { name: "ADHD Screening", count: totalReports > 0 ? Math.round(totalReports * 0.15) : 0, pct: totalReports > 0 ? 15 : 0 },
      { name: "Initial Screening", count: totalReports > 0 ? Math.round(totalReports * 0.10) : 0, pct: totalReports > 0 ? 10 : 0 },
    ];

    return {
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        activeDoctors,
        totalParents,
        totalAppointments,
        appointmentsConfirmed,
        appointmentsPending,
        appointmentsCancelled,
        totalReports,
        recentNotifications: JSON.parse(JSON.stringify(recentNotifications)),
        monthlyGrowth: scaledGrowth,
        topAssessments,
      },
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return { success: false, message: "Failed to fetch dashboard data" };
  }
};

/* =======================
   TOGGLE USER STATUS
======================= */
export const toggleUserStatus = async (userId: string) => {
  try {
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    user.isActive = !user.isActive;
    await user.save();

    return {
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    console.error("Error toggling user status:", error);
    return { success: false, message: "Failed to toggle user status" };
  }
};

/* =======================
   GET NOTIFICATIONS
======================= */
export const getNotifications = async () => {
  try {
    await connectDB();

    // Auto-seed if notifications count is 0
    const count = await Notification.countDocuments();
    if (count === 0) {
      // Seed contacts
      const contacts = await Contact.find({}).sort({ createdAt: -1 });
      for (const contact of contacts) {
        await Notification.create({
          type: "contact",
          title: "New Contact Message",
          message: `${contact.firstName} ${contact.lastName} submitted a message: "${contact.message.substring(0, 100)}${contact.message.length > 100 ? '...' : ''}"`,
          read: false,
          createdAt: contact.createdAt,
        });
      }

      // Seed pending doctors
      const pendingDocs = await Doctor.find({ isActive: false, isVerified: true });
      for (const doc of pendingDocs) {
        await Notification.create({
          type: "user",
          title: "New User Registration",
          message: `Dr. ${doc.firstname} ${doc.lastname} has registered as a doctor and is awaiting approval.`,
          read: false,
          createdAt: (doc as any).createdAt || new Date(),
        });
      }
    }

    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    return { success: true, notifications: JSON.parse(JSON.stringify(notifications)) };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, message: "Failed to fetch notifications", notifications: [] };
  }
};

/* =======================
   MARK NOTIFICATION AS READ
======================= */
export const markNotificationAsRead = async (id: string) => {
  try {
    await connectDB();
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return { success: false, message: "Notification not found" };
    }
    return { success: true, notification: JSON.parse(JSON.stringify(notification)) };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, message: "Failed to mark notification as read" };
  }
};

/* =======================
   MARK ALL NOTIFICATIONS AS READ
======================= */
export const markAllNotificationsAsRead = async () => {
  try {
    await connectDB();
    await Notification.updateMany({ read: false }, { read: true });
    return { success: true, message: "All notifications marked as read" };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, message: "Failed to mark all notifications as read" };
  }
};

/* =======================
   DELETE NOTIFICATION
======================= */
export const deleteNotificationAction = async (id: string) => {
  try {
    await connectDB();
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, message: "Notification not found" };
    }
    return { success: true, message: "Notification deleted successfully" };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { success: false, message: "Failed to delete notification" };
  }
};

/* =======================
   CLEAR ALL NOTIFICATIONS
======================= */
export const clearAllNotifications = async () => {
  try {
    await connectDB();
    await Notification.deleteMany({});
    return { success: true, message: "All notifications cleared successfully" };
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return { success: false, message: "Failed to clear notifications" };
  }
};



