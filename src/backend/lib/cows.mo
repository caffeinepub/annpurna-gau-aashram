import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

module {
  public func addCow(
    cows : List.List<Types.Cow>,
    cowIdCounter : Nat,
    name : Text,
    breed : Text,
    age : Nat,
    healthStatus : Text,
    description : Text,
    tagNumber : Text,
    qrCode : Text,
  ) : Nat {
    Runtime.trap("not implemented");
  };

  public func getCow(
    cows : List.List<Types.Cow>,
    id : Nat,
  ) : Types.Cow {
    Runtime.trap("not implemented");
  };

  public func getAllCows(cows : List.List<Types.Cow>) : [Types.Cow] {
    Runtime.trap("not implemented");
  };

  public func updateCow(
    cows : List.List<Types.Cow>,
    id : Nat,
    name : Text,
    breed : Text,
    age : Nat,
    healthStatus : Text,
    description : Text,
    tagNumber : Text,
    qrCode : Text,
  ) {
    Runtime.trap("not implemented");
  };

  public func deleteCow(
    cows : List.List<Types.Cow>,
    id : Nat,
  ) {
    Runtime.trap("not implemented");
  };

  public func getCowByTag(
    cows : List.List<Types.Cow>,
    tag : Text,
  ) : ?Types.Cow {
    Runtime.trap("not implemented");
  };
};
