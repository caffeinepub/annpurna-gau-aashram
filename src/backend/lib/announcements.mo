import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

module {
  public func addAnnouncement(
    announcements : List.List<Types.Announcement>,
    announcementIdCounter : Nat,
    title : Text,
    titleHindi : Text,
    content : Text,
    contentHindi : Text,
    isActive : Bool,
  ) : Nat {
    Runtime.trap("not implemented");
  };

  public func getAnnouncement(
    announcements : List.List<Types.Announcement>,
    id : Nat,
  ) : Types.Announcement {
    Runtime.trap("not implemented");
  };

  public func getActiveAnnouncements(
    announcements : List.List<Types.Announcement>,
  ) : [Types.Announcement] {
    Runtime.trap("not implemented");
  };
};
