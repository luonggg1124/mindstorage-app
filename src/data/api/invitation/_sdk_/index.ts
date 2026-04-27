import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { InviteError, InviteRequest, InviteResponse } from "./invite.type";
import type { AcceptInvitationError, AcceptInvitationRequest, AcceptInvitationResponse } from "./accept.type";
import type { RejectInvitationError, RejectInvitationRequest, RejectInvitationResponse } from "./reject.type";

export class InvitationSDK {
  static async invite<ThrowOnError extends boolean = false>(request: InviteRequest) {
    const response = await client.post<InviteResponse, InviteError, ThrowOnError>({
      url: apiPaths.invitation.invite.path,
      body: request.body,
    });
    return response;
  }

  static async accept<ThrowOnError extends boolean = false>(request: AcceptInvitationRequest) {
    const response = await client.post<AcceptInvitationResponse, AcceptInvitationError, ThrowOnError>({
      url: apiPaths.invitation.accept.getPath(request.params.id),
    });
    return response;
  }

  static async reject<ThrowOnError extends boolean = false>(request: RejectInvitationRequest) {
    const response = await client.post<RejectInvitationResponse, RejectInvitationError, ThrowOnError>({
      url: apiPaths.invitation.reject.getPath(request.params.id),
    });
    return response;
  }
}

export type * from "./invite.type";
export type * from "./accept.type";
export type * from "./reject.type";

