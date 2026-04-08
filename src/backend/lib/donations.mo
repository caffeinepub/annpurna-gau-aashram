import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

module {
  public func addDonation(
    donations : List.List<Types.Donation>,
    donationIdCounter : Nat,
    donorName : Text,
    amount : Float,
    message : Text,
    purpose : Text,
  ) : Nat {
    Runtime.trap("not implemented");
  };

  public func getDonation(
    donations : List.List<Types.Donation>,
    id : Nat,
  ) : Types.Donation {
    Runtime.trap("not implemented");
  };

  public func getAllDonations(donations : List.List<Types.Donation>) : [Types.Donation] {
    Runtime.trap("not implemented");
  };
};
