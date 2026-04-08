import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

module {
  public func addCalf(
    calves : List.List<Types.Calf>,
    cows : List.List<Types.Cow>,
    calfIdCounter : Nat,
    cowId : Nat,
    birthMonth : Nat,
    birthYear : Nat,
    gender : Text,
    tagNumber : Text,
    notes : Text,
  ) : Nat {
    Runtime.trap("not implemented");
  };

  public func getCalvesByCow(
    calves : List.List<Types.Calf>,
    cowId : Nat,
  ) : [Types.Calf] {
    Runtime.trap("not implemented");
  };

  public func deleteCalf(
    calves : List.List<Types.Calf>,
    id : Nat,
  ) {
    Runtime.trap("not implemented");
  };
};
