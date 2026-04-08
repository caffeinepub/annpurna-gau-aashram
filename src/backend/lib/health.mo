import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

module {
  public func addHealthRecord(
    records : List.List<Types.HealthRecord>,
    cows : List.List<Types.Cow>,
    healthRecordIdCounter : Nat,
    cowId : Nat,
    notes : Text,
    status : Text,
    vetName : Text,
  ) : Nat {
    Runtime.trap("not implemented");
  };

  public func getHealthRecord(
    records : List.List<Types.HealthRecord>,
    id : Nat,
  ) : Types.HealthRecord {
    Runtime.trap("not implemented");
  };

  public func getHealthRecordsByCow(
    records : List.List<Types.HealthRecord>,
    cowId : Nat,
  ) : [Types.HealthRecord] {
    Runtime.trap("not implemented");
  };
};
