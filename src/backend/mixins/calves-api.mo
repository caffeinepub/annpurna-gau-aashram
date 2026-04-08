import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

mixin (
  calves : List.List<Types.Calf>,
  cows : List.List<Types.Cow>,
  calfIdCounter : Nat,
  changeLogs : List.List<Types.ChangeLog>,
  changeLogIdCounter : Nat,
) {
  public shared ({ caller }) func addCalf(
    cowId : Nat,
    birthMonth : Nat,
    birthYear : Nat,
    gender : Text,
    tagNumber : Text,
    notes : Text,
    changedBy : Text,
  ) : async Nat {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getCalvesByCow(cowId : Nat) : async [Types.Calf] {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func deleteCalf(id : Nat, changedBy : Text) : async () {
    Runtime.trap("not implemented");
  };
};
