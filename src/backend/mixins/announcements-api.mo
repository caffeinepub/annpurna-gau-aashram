import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

mixin (
  announcements : List.List<Types.Announcement>,
  announcementIdCounter : Nat,
  changeLogs : List.List<Types.ChangeLog>,
  changeLogIdCounter : Nat,
) {
  public shared ({ caller }) func addAnnouncement(
    title : Text,
    titleHindi : Text,
    content : Text,
    contentHindi : Text,
    isActive : Bool,
    changedBy : Text,
  ) : async Nat {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getAnnouncement(id : Nat) : async Types.Announcement {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getActiveAnnouncements() : async [Types.Announcement] {
    Runtime.trap("not implemented");
  };
};
