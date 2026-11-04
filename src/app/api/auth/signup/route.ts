import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, email, password, name } = body;

    if (!role || !email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email, password, and portal role are required.' },
        { status: 400 }
      );
    }

    if (role === 'admin') {
      return NextResponse.json(
        { error: 'Public administrator registration is prohibited. Only an existing super administrator can grant admin privileges.' },
        { status: 403 }
      );
    }

    if (role === 'teacher') {
      const validInvitationCodes = ['FA-TEACH-2026', 'FA-FACULTY-MASTER', 'FUZION-TEACH-VIP'];
      const inviteCode = String(body.invitationCode || '').trim().toUpperCase();

      if (!validInvitationCodes.includes(inviteCode)) {
        return NextResponse.json(
          { error: 'Invalid or expired Teacher Invitation Code. Please obtain an authorised invitation code from Fuzion Academy administration.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        status: 'pending_approval',
        message: 'Teacher registration received! Your account is pending Super Administrator approval.',
      });
    }

    if (role === 'parent') {
      const studentCode = String(body.studentCode || '').trim().toUpperCase();
      if (!studentCode) {
        return NextResponse.json(
          { error: 'Student Admission Code is required to link parent account.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        status: 'active',
        message: `Parent registered and linked to student ${studentCode}!`,
      });
    }

    // Default Student
    return NextResponse.json({
      success: true,
      status: 'active',
      message: 'Student registration completed successfully! Welcome to Fuzion Academy.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration processing error' },
      { status: 500 }
    );
  }
}
