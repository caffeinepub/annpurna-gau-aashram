import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

mixin (
  milkRecords : List.List<Types.MilkRecord>,
  milkRecordIdCounter : Nat,
  changeLogs : List.List<Types.ChangeLog>,
  changeLogIdCounter : Nat,
) {
  public shared ({ caller }) func addMilkRecord(
    cowId : Nat,
    cowName : Text,
    date : Text,
    morning : Float,
    evening : Float,
    changedBy : Text,
  ) : async Nat {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getMilkRecordsByDate(date : Text) : async [Types.MilkRecord] {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getAllMilkRecords() : async [Types.MilkRecord] {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func deleteMilkRecord(id : Nat, changedBy : Text) : async () {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getTodayMilkRecords() : async [Types.MilkRecord] {
    Runtime.trap("not implemented");
  };
};
