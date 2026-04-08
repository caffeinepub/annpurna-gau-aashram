import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

module {
  public func addMilkRecord(
    records : List.List<Types.MilkRecord>,
    milkRecordIdCounter : Nat,
    cowId : Nat,
    cowName : Text,
    date : Text,
    morning : Float,
    evening : Float,
    changedBy : Text,
  ) : Nat {
    Runtime.trap("not implemented");
  };

  public func getMilkRecordsByDate(
    records : List.List<Types.MilkRecord>,
    date : Text,
  ) : [Types.MilkRecord] {
    Runtime.trap("not implemented");
  };

  public func getAllMilkRecords(records : List.List<Types.MilkRecord>) : [Types.MilkRecord] {
    Runtime.trap("not implemented");
  };

  public func deleteMilkRecord(
    records : List.List<Types.MilkRecord>,
    id : Nat,
  ) {
    Runtime.trap("not implemented");
  };

  public func getTodayMilkRecords(records : List.List<Types.MilkRecord>) : [Types.MilkRecord] {
    Runtime.trap("not implemented");
  };
};
