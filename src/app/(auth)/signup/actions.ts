"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { dashboardPathForRole } from "@/lib/auth";
import { geocodeAddress } from "@/lib/geocode";

const schema = z.object({
  role: z.enum(["DONOR", "NGO", "VOLUNTEER"], {
    error: "Choose who you're signing up as.",
  }),
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
  organizationName: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export type SignUpState = { error?: string };

export async function signUp(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const parsed = schema.safeParse({
    role: formData.get("role"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    organizationName: formData.get("organizationName") || undefined,
    address: formData.get("address") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { role, fullName, email, password, organizationName, address } = parsed.data;

  if (role === "NGO" && !organizationName) {
    return { error: "Tell us your organization's name." };
  }
  if (role === "NGO" && !address) {
    return { error: "An address helps the matching engine find you — add one." };
  }

  const geocoded = address ? await geocodeAddress(address) : null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Could not create your account. Try again." };

  try {
    await prisma.profile.create({
      data: {
        id: data.user.id,
        role,
        fullName,
        address: address || null,
        lat: geocoded?.lat ?? null,
        lng: geocoded?.lng ?? null,
        ...(role === "DONOR" && {
          donorProfile: { create: { organizationName: organizationName || null } },
        }),
        ...(role === "NGO" && {
          ngoProfile: { create: { organizationName: organizationName! } },
        }),
        ...(role === "VOLUNTEER" && { volunteerProfile: { create: {} } }),
      },
    });
  } catch (err) {
    console.error("signup: profile creation failed for auth user", data.user.id, err);
    return {
      error:
        "Your account was created but we couldn't finish setting up your profile. Please try signing in — if the problem continues, contact support.",
    };
  }

  if (!data.session) {
    redirect("/login?confirmEmail=1");
  }

  redirect(dashboardPathForRole(role));
}
