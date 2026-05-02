import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import apiPaths from "@/paths/api";
import type { InviteRequest, InviteResponse } from "./invite.type";
import type { AcceptInvitationRequest, AcceptInvitationResponse } from "./accept.type";
import type { RejectInvitationRequest, RejectInvitationResponse } from "./reject.type";

export class InvitationSDK {
  static async invite(request: InviteRequest) {
    const response = await safeRequest(() =>
      client.post<InviteResponse, ApiError, true>({
        url: apiPaths.invitation.invite.path,
        body: request.body,
        throwOnError: true,
      })
    );
    return response;
  }

  static async accept(request: AcceptInvitationRequest) {
    const response = await safeRequest(() =>
      client.post<AcceptInvitationResponse, ApiError, true>({
        url: apiPaths.invitation.accept.getPath(request.params.id),
        throwOnError: true,
      })
    );
    return response;
  }

  static async reject(request: RejectInvitationRequest) {
    const response = await safeRequest(() =>
      client.post<RejectInvitationResponse, ApiError, true>({
        url: apiPaths.invitation.reject.getPath(request.params.id),
        throwOnError: true,
      })
    );
    return response;
  }
}

export type * from "./invite.type";
export type * from "./accept.type";
export type * from "./reject.type";

