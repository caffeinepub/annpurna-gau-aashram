import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

mixin (
  healthRecords : List.List<Types.HealthRecord>,
  cows : List.List<Types.Cow>,
  healthRecordIdCounter : Nat,
  changeLogs : List.List<Types.ChangeLog>,
  changeLogIdCounter : Nat,
) {
  public shared ({ caller }) func addHealthRecord(
    cowId : Nat,
    notes : Text,
    status : Text,
    vetName : Text,
    changedBy : Text,
  ) : async Nat {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getHealthRecord(id : Nat) : async Types.HealthRecord {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getHealthRecordsByCow(cowId : Nat) : async [Types.HealthRecord] {
    Runtime.trap("not implemented");
  };
};
