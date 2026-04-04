import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const session = await getServerSession(authOptions);

if (!session?.user?.id) {
  throw new Error("Unauthorized");
}

const userId = session.user.id;
