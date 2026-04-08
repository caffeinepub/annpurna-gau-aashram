import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

module {
  let MAX_USERS : Nat = 50;

  public func ensureDefaultAdmin(
    users : List.List<Types.User>,
    userIdCounter : Nat,
  ) : Nat {
    Runtime.trap("not implemented");
  };

  public func getUserByPin(
    users : List.List<Types.User>,
    pin : Text,
  ) : ?Types.User {
    Runtime.trap("not implemented");
  };

  public func getUsersByPin(
    users : List.List<Types.User>,
    pin : Text,
  ) : [Types.User] {
    Runtime.trap("not implemented");
  };

  public func createUser(
    users : List.List<Types.User>,
    userIdCounter : Nat,
    name : Text,
    role : Text,
    pin : Text,
  ) : Nat {
    Runtime.trap("not implemented");
  };

  public func deleteUser(
    users : List.List<Types.User>,
    heartbeats : List.List<(Nat, Int)>,
    id : Nat,
  ) {
    Runtime.trap("not implemented");
  };

  public func changeUserPin(
    users : List.List<Types.User>,
    id : Nat,
    newPin : Text,
  ) : Text {
    Runtime.trap("not implemented"); // returns old user name for log
  };

  public func getAllUsers(users : List.List<Types.User>) : [Types.User] {
    Runtime.trap("not implemented");
  };
};
