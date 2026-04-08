import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

module {
  public func addChangeLog(
    logs : List.List<Types.ChangeLog>,
    changeLogIdCounter : Nat,
    userName : Text,
    action : Text,
    entity : Text,
    entityName : Text,
    details : Text,
  ) {
    Runtime.trap("not implemented");
  };

  public func getAllChangeLogs(logs : List.List<Types.ChangeLog>) : [Types.ChangeLog] {
    Runtime.trap("not implemented");
  };
};
