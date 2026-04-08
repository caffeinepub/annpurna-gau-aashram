import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

mixin (
  changeLogs : List.List<Types.ChangeLog>,
  changeLogIdCounter : Nat,
) {
  public shared ({ caller }) func addChangeLog(
    userName : Text,
    action : Text,
    entity : Text,
    entityName : Text,
    details : Text,
  ) : async () {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getAllChangeLogs() : async [Types.ChangeLog] {
    Runtime.trap("not implemented");
  };
};
