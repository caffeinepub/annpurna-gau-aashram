import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

mixin (
  cows : List.List<Types.Cow>,
  cowIdCounter : Nat,
  changeLogs : List.List<Types.ChangeLog>,
  changeLogIdCounter : Nat,
) {
  public shared ({ caller }) func addCow(
    name : Text,
    breed : Text,
    age : Nat,
    healthStatus : Text,
    description : Text,
    tagNumber : Text,
    qrCode : Text,
    changedBy : Text,
  ) : async Nat {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getCow(id : Nat) : async Types.Cow {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getAllCows() : async [Types.Cow] {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func updateCow(
    id : Nat,
    name : Text,
    breed : Text,
    age : Nat,
    healthStatus : Text,
    description : Text,
    tagNumber : Text,
    qrCode : Text,
    changedBy : Text,
  ) : async () {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func deleteCow(id : Nat, changedBy : Text) : async () {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getCowByTag(tag : Text) : async ?Types.Cow {
    Runtime.trap("not implemented");
  };
};
