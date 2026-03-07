import Map "mo:core/Map";

module {
  type Cow = {
    id : Nat;
    name : Text;
    breed : Text;
    age : Nat;
    healthStatus : Text;
    description : Text;
    addedDate : Int;
  };

  type Donation = {
    id : Nat;
    donorName : Text;
    amount : Float;
    date : Int;
    message : Text;
    purpose : Text;
  };

  type HealthRecord = {
    id : Nat;
    cowId : Nat;
    date : Int;
    notes : Text;
    status : Text;
    vetName : Text;
  };

  type Announcement = {
    id : Nat;
    title : Text;
    titleHindi : Text;
    content : Text;
    contentHindi : Text;
    date : Int;
    isActive : Bool;
  };

  type Actor = {
    cows : Map.Map<Nat, Cow>;
    donations : Map.Map<Nat, Donation>;
    healthRecords : Map.Map<Nat, HealthRecord>;
    announcements : Map.Map<Nat, Announcement>;
    cowIdCounter : Nat;
    donationIdCounter : Nat;
    healthRecordIdCounter : Nat;
    announcementIdCounter : Nat;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};

