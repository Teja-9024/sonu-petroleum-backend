import { Notification } from "./notification.model";
import { User } from "../user/user.model";

export async function createOwnerNotifications(payload: {
  title: string; body: string; data?: Record<string, any>;
}) {
  const owners = await User.find({ role: "owner" }).select("_id");
  if (!owners.length) return;
  await Notification.insertMany(
    owners.map(o => ({
      recipient: o._id,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {}
    }))
  );
}
