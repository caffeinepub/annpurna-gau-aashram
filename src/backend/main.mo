import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Text "mo:core/Text";



actor {
  type Cow = {
    id : Nat;
    name : Text;
    breed : Text;
    age : Nat;
    healthStatus : Text;
    description : Text;
    addedDate : Time.Time;
    tagNumber : Text;
    qrCode : Text;
  };

  type Calf = {
    id : Nat;
    cowId : Nat;
    birthMonth : Nat;
    birthYear : Nat;
    gender : Text;
    tagNumber : Text;
    notes : Text;
    addedDate : Time.Time;
  };

  type Donation = {
    id : Nat;
    donorName : Text;
    amount : Float;
    date : Time.Time;
    message : Text;
    purpose : Text;
  };

  type HealthRecord = {
    id : Nat;
    cowId : Nat;
    date : Time.Time;
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
    date : Time.Time;
    isActive : Bool;
  };

  let cows = Map.empty<Nat, Cow>();
  let calves = Map.empty<Nat, Calf>();
  let donations = Map.empty<Nat, Donation>();
  let healthRecords = Map.empty<Nat, HealthRecord>();
  let announcements = Map.empty<Nat, Announcement>();

  var cowIdCounter = 1;
  var calfIdCounter = 1;
  var donationIdCounter = 1;
  var healthRecordIdCounter = 1;
  var announcementIdCounter = 1;

  // Cow CRUD
  public shared ({ caller }) func addCow(
    name : Text,
    breed : Text,
    age : Nat,
    healthStatus : Text,
    description : Text,
    tagNumber : Text,
    qrCode : Text,
  ) : async Nat {
    let id = cowIdCounter;
    cowIdCounter += 1;
    let cow : Cow = {
      id;
      name;
      breed;
      age;
      healthStatus;
      description;
      addedDate = Time.now();
      tagNumber;
      qrCode;
    };
    cows.add(id, cow);
    id;
  };

  public query ({ caller }) func getCow(id : Nat) : async Cow {
    switch (cows.get(id)) {
      case (null) { Runtime.trap("Cow with id " # id.toText() # " not found") };
      case (?cow) { cow };
    };
  };

  public query ({ caller }) func getAllCows() : async [Cow] {
    cows.values().toArray();
  };

  public shared ({ caller }) func updateCow(
    id : Nat,
    name : Text,
    breed : Text,
    age : Nat,
    healthStatus : Text,
    description : Text,
    tagNumber : Text,
    qrCode : Text,
  ) : async () {
    switch (cows.get(id)) {
      case (null) { Runtime.trap("Cow with id " # id.toText() # " not found") };
      case (?existingCow) {
        let updatedCow : Cow = {
          id;
          name;
          breed;
          age;
          healthStatus;
          description;
          addedDate = existingCow.addedDate;
          tagNumber;
          qrCode;
        };
        cows.add(id, updatedCow);
      };
    };
  };

  public shared ({ caller }) func deleteCow(id : Nat) : async () {
    if (not cows.containsKey(id)) {
      Runtime.trap("Cow with id " # id.toText() # " not found");
    };
    cows.remove(id);
  };

  public query ({ caller }) func getCowByTag(tag : Text) : async ?Cow {
    if (tag == "") {
      return null;
    };
    let iter = cows.values();
    iter.find(
      func(cow) {
        (cow.tagNumber != "" and cow.tagNumber == tag) or (cow.qrCode != "" and cow.qrCode == tag);
      }
    );
  };

  // Calf CRUD
  public shared ({ caller }) func addCalf(
    cowId : Nat,
    birthMonth : Nat,
    birthYear : Nat,
    gender : Text,
    tagNumber : Text,
    notes : Text,
  ) : async Nat {
    switch (cows.get(cowId)) {
      case (null) { Runtime.trap("Cow not found") };
      case (?_) {
        let id = calfIdCounter;
        calfIdCounter += 1;
        let calf : Calf = {
          id;
          cowId;
          birthMonth;
          birthYear;
          gender;
          tagNumber;
          notes;
          addedDate = Time.now();
        };
        calves.add(id, calf);
        id;
      };
    };
  };

  public query ({ caller }) func getCalvesByCow(cowId : Nat) : async [Calf] {
    let iter = calves.values();
    iter.filter(func(calf) { calf.cowId == cowId }).toArray();
  };

  public shared ({ caller }) func deleteCalf(id : Nat) : async () {
    if (not calves.containsKey(id)) {
      Runtime.trap("Calf with id " # id.toText() # " not found");
    };
    calves.remove(id);
  };

  // Donation CRUD
  public shared ({ caller }) func addDonation(donorName : Text, amount : Float, message : Text, purpose : Text) : async Nat {
    let id = donationIdCounter;
    donationIdCounter += 1;
    let donation : Donation = {
      id;
      donorName;
      amount;
      date = Time.now();
      message;
      purpose;
    };
    donations.add(id, donation);
    id;
  };

  public query ({ caller }) func getDonation(id : Nat) : async Donation {
    switch (donations.get(id)) {
      case (null) { Runtime.trap("Donation not found") };
      case (?donation) { donation };
    };
  };

  public query ({ caller }) func getAllDonations() : async [Donation] {
    donations.values().toArray();
  };

  // HealthRecord CRUD
  public shared ({ caller }) func addHealthRecord(cowId : Nat, notes : Text, status : Text, vetName : Text) : async Nat {
    if (not cows.containsKey(cowId)) {
      Runtime.trap("Cow not found");
    };
    let id = healthRecordIdCounter;
    healthRecordIdCounter += 1;
    let record : HealthRecord = {
      id;
      cowId;
      date = Time.now();
      notes;
      status;
      vetName;
    };
    healthRecords.add(id, record);
    id;
  };

  public query ({ caller }) func getHealthRecord(id : Nat) : async HealthRecord {
    switch (healthRecords.get(id)) {
      case (null) { Runtime.trap("Health record not found") };
      case (?record) { record };
    };
  };

  public query ({ caller }) func getHealthRecordsByCow(cowId : Nat) : async [HealthRecord] {
    let iter = healthRecords.values();
    iter.filter(func(record) { record.cowId == cowId }).toArray();
  };

  // Announcement CRUD
  public shared ({ caller }) func addAnnouncement(title : Text, titleHindi : Text, content : Text, contentHindi : Text, isActive : Bool) : async Nat {
    let id = announcementIdCounter;
    announcementIdCounter += 1;
    let announcement : Announcement = {
      id;
      title;
      titleHindi;
      content;
      contentHindi;
      date = Time.now();
      isActive;
    };
    announcements.add(id, announcement);
    id;
  };

  public query ({ caller }) func getAnnouncement(id : Nat) : async Announcement {
    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?announcement) { announcement };
    };
  };

  public query ({ caller }) func getActiveAnnouncements() : async [Announcement] {
    let iter = announcements.values();
    iter.filter(func(a) { a.isActive }).toArray();
  };
};
