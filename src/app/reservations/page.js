import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { isEmailAllowed } from "../utils/auth";
import { redirect } from "next/navigation";
import ReservationForm from "@/components/ReservationForm";

export default async function ReservationsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const allowed = await isEmailAllowed(session.user.email);
  if (!allowed) {
    redirect("/auth/error?error=UnauthorizedEmail");
  }

  return <ReservationForm session={session} />;
}