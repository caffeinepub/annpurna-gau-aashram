import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

mixin (
  donations : List.List<Types.Donation>,
  donationIdCounter : Nat,
  changeLogs : List.List<Types.ChangeLog>,
  changeLogIdCounter : Nat,
) {
  public shared ({ caller }) func addDonation(
    donorName : Text,
    amount : Float,
    message : Text,
    purpose : Text,
    changedBy : Text,
  ) : async Nat {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getDonation(id : Nat) : async Types.Donation {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getAllDonations() : async [Types.Donation] {
    Runtime.trap("not implemented");
  };
};
