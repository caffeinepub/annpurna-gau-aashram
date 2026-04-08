import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

mixin (
  users : List.List<Types.User>,
  userIdCounter : Nat,
  heartbeats : List.List<(Nat, Int)>,
) {
  public shared ({ caller }) func ensureDefaultAdmin() : async () {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getUserByPin(pin : Text) : async ?Types.User {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getUsersByPin(pin : Text) : async [Types.User] {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func createUser(name : Text, role : Text, pin : Text) : async Nat {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func deleteUser(id : Nat) : async () {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func changeUserPin(id : Nat, newPin : Text, changedBy : Text) : async () {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getAllUsers() : async [Types.User] {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func sendHeartbeat(userId : Nat) : async Bool {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getOnlineUsers() : async [Nat] {
    Runtime.trap("not implemented");
  };
};
