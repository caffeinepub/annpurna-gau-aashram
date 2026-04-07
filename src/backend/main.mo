import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Migration "migration";

// Use with clause for migration
(with migration = Migration.run)
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

  type User = {
    id : Nat;
    name : Text;
    role : Text;
    pin : Text;
  };

  type ChangeLog = {
    id : Nat;
    userName : Text;
    action : Text;
    entity : Text;
    entityName : Text;
    details : Text;
    timestamp : Time.Time;
  };

  type MilkRecord = {
    id : Nat;
    cowId : Nat;
    cowName : Text;
    date : Text;
    morning : Float;
    evening : Float;
    addedDate : Time.Time;
    changedBy : Text;
  };

  type GaushaalaProfile = {
    name : Text;
    nameHindi : Text;
    description : Text;
    descriptionHindi : Text;
    phone : Text;
    address : Text;
    logoBase64 : Text;
  };

  type FeedStock = {
    id : Nat;
    feedType : Text; // "wet" or "dry"
    totalStock : Float; // in kg
    dailyPerCow : Float; // average daily consumption per cow in kg
    lastUpdated : Time.Time;
    updatedBy : Text;
  };

  type FeedHistory = {
    id : Nat;
    feedType : Text; // "wet" or "dry"
    action : Text; // "add" or "consume"
    quantity : Float; // in kg
    notes : Text;
    date : Time.Time;
    recordedBy : Text;
  };

  let MAX_USERS : Nat = 50;

  stable var cowsArr : [Cow] = [];
  stable var calvesArr : [Calf] = [];
  stable var donationsArr : [Donation] = [];
  stable var healthRecordsArr : [HealthRecord] = [];
  stable var announcementsArr : [Announcement] = [];
  stable var usersArr : [User] = [];
  stable var changeLogsArr : [ChangeLog] = [];
  stable var milkRecordsArr : [MilkRecord] = [];
  stable var userHeartbeatsArr : [(Nat, Time.Time)] = [];
  stable var feedStocksArr : [FeedStock] = [];
  stable var feedHistoriesArr : [FeedHistory] = [];

  stable var cowIdCounter = 1;
  stable var calfIdCounter = 1;
  stable var donationIdCounter = 1;
  stable var healthRecordIdCounter = 1;
  stable var announcementIdCounter = 1;
  stable var userIdCounter = 2;
  stable var changeLogIdCounter = 1;
  stable var milkRecordIdCounter = 1;
  stable var feedStockIdCounter = 3;
  stable var feedHistoryIdCounter = 1;

  stable var gaushaalaProfile : GaushaalaProfile = {
    name = "Annpurna Gau Aashram";
    nameHindi = "अन्नपूर्णा गौ आश्रम";
    description = "A shelter dedicated to the care and protection of animals.";
    descriptionHindi = "जानवरों की देखभाल और सुरक्षा के लिए समर्पित एक गौशाला।";
    phone = "";
    address = "";
    logoBase64 = "";
  };

  // Helper function to compare by date
  func compareByDate(a : MilkRecord, b : MilkRecord) : Order.Order {
    Int.compare(a.addedDate, b.addedDate);
  };

  func compareFeedHistoryByDate(a : FeedHistory, b : FeedHistory) : Order.Order {
    Int.compare(a.date, b.date);
  };

  func recordLog(
    userName : Text,
    action : Text,
    entity : Text,
    entityName : Text,
    details : Text,
  ) {
    let id = changeLogIdCounter;
    changeLogIdCounter += 1;
    let log : ChangeLog = {
      id;
      userName;
      action;
      entity;
      entityName;
      details;
      timestamp = Time.now();
    };
    changeLogsArr := changeLogsArr.concat([log]);
  };

  public shared ({ caller }) func sendHeartbeat(userId : Nat) : async () {
    let now = Time.now();
    userHeartbeatsArr := userHeartbeatsArr.filter(func((id, _)) { id != userId });
    userHeartbeatsArr := userHeartbeatsArr.concat([(userId, now)]);
  };

  public query ({ caller }) func getOnlineUsers() : async [Nat] {
    let threeMinutes : Int = 180_000_000_000;
    let now = Time.now();
    userHeartbeatsArr.filter(
      func((uid, ts)) { (now - ts) < threeMinutes }
    ).map(func((uid, _)) { uid });
  };

  // ================================= USERS =================================
  public query ({ caller }) func getAllUsers() : async [User] {
    usersArr;
  };

  public query ({ caller }) func getUserByPin(pin : Text) : async ?User {
    usersArr.find(func(u) { u.pin == pin });
  };

  public query ({ caller }) func getUsersByPin(pin : Text) : async [User] {
    let allUsersIter = usersArr.values();
    allUsersIter.filter(func(u) { u.pin == pin }).toArray();
  };

  public shared ({ caller }) func createUser(name : Text, role : Text, pin : Text) : async Nat {
    let currentCount = usersArr.size();
    if (currentCount >= MAX_USERS) {
      Runtime.trap("User limit reached: maximum " # MAX_USERS.toText() # " users allowed");
    };
    let id = userIdCounter;
    userIdCounter += 1;
    let user : User = {
      id;
      name;
      role;
      pin;
    };
    usersArr := usersArr.concat([user]);
    id;
  };

  public shared ({ caller }) func deleteUser(id : Nat) : async () {
    let userExists = usersArr.find(func(u) { u.id == id }) != null;
    if (not userExists) {
      Runtime.trap("User not found");
    };
    usersArr := usersArr.filter(func(u) { u.id != id });
    userHeartbeatsArr := userHeartbeatsArr.filter(func((uid, _)) { uid != id });
  };

  public shared ({ caller }) func changeUserPin(id : Nat, newPin : Text, changedBy : Text) : async () {
    let userIndex = usersArr.findIndex(func(u) { u.id == id });
    switch (userIndex) {
      case (null) { Runtime.trap("User not found") };
      case (?index) {
        let existingUser = usersArr[index];
        let updatedUser : User = {
          id = existingUser.id;
          name = existingUser.name;
          role = existingUser.role;
          pin = newPin;
        };
        var newUsersArr = usersArr;
        newUsersArr := newUsersArr.sliceToArray(0, index).concat(newUsersArr.sliceToArray(index + 1, newUsersArr.size())).concat([updatedUser]);
        usersArr := newUsersArr;

        recordLog(
          changedBy,
          "edit",
          "user",
          existingUser.name,
          "PIN changed for user: " # existingUser.name,
        );
      };
    };
  };

  public shared ({ caller }) func ensureDefaultAdmin() : async () {
    let adminExists = usersArr.find(func(u) { u.role == "admin" });
    switch (adminExists) {
      case (null) {
        let defaultAdminExists = usersArr.find(func(u) { u.id == 1 }) != null;
        if (not defaultAdminExists) {
          let defaultAdmin : User = {
            id = 1;
            name = "Admin";
            role = "admin";
            pin = "000000";
          };
          usersArr := usersArr.concat([defaultAdmin]);
        };
        if (userIdCounter < 2) { userIdCounter := 2 };
      };
      case (?_) {};
    };
  };

  // ================================= CHANGE LOGS =================================
  public shared ({ caller }) func addChangeLog(
    userName : Text,
    action : Text,
    entity : Text,
    entityName : Text,
    details : Text,
  ) : async () {
    recordLog(userName, action, entity, entityName, details);
  };

  public query ({ caller }) func getAllChangeLogs() : async [ChangeLog] {
    changeLogsArr;
  };

  // ================================= COWS =================================

  public shared ({ caller }) func addCow(
    name : Text,
    breed : Text,
    age : Nat,
    healthStatus : Text,
    description : Text,
    tagNumber : Text,
    qrCode : Text,
    changedBy : Text,
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
    cowsArr := cowsArr.concat([cow]);
    recordLog(changedBy, "add", "cow", name, "Added cow: " # name);
    id;
  };

  public query ({ caller }) func getCow(id : Nat) : async Cow {
    switch (cowsArr.find(func(cow) { cow.id == id })) {
      case (null) { Runtime.trap("Cow with id " # id.toText() # " not found") };
      case (?cow) { cow };
    };
  };

  public query ({ caller }) func getAllCows() : async [Cow] {
    cowsArr;
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
    changedBy : Text,
  ) : async () {
    let index = cowsArr.findIndex(func(cow) { cow.id == id });
    switch (index) {
      case (null) { Runtime.trap("Cow with id " # id.toText() # " not found") };
      case (?oldIndex) {
        let existingCow = cowsArr[oldIndex];
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
        var newCowsArr = cowsArr;
        newCowsArr := newCowsArr.sliceToArray(0, oldIndex).concat(newCowsArr.sliceToArray(oldIndex + 1, newCowsArr.size())).concat([updatedCow]);
        cowsArr := newCowsArr;

        recordLog(changedBy, "edit", "cow", name, "Updated cow: " # name);
      };
    };
  };

  public shared ({ caller }) func deleteCow(id : Nat, changedBy : Text) : async () {
    let cowExists = cowsArr.find(func(cow) { cow.id == id }) != null;
    if (not cowExists) {
      Runtime.trap("Cow with id " # id.toText() # " not found");
    };
    cowsArr := cowsArr.filter(func(cow) { cow.id != id });
    recordLog(
      changedBy,
      "delete",
      "cow",
      id.toText(),
      "Deleted cow id: " # id.toText(),
    );
  };

  public query ({ caller }) func getCowByTag(tag : Text) : async ?Cow {
    cowsArr.find(
      func(cow) {
        cow.tagNumber == tag or cow.qrCode == tag;
      }
    );
  };

  // ================================= CALVES =================================
  public shared ({ caller }) func addCalf(
    cowId : Nat,
    birthMonth : Nat,
    birthYear : Nat,
    gender : Text,
    tagNumber : Text,
    notes : Text,
    changedBy : Text,
  ) : async Nat {
    let cowExists = cowsArr.find(func(cow) { cow.id == cowId });
    switch (cowExists) {
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
        calvesArr := calvesArr.concat([calf]);
        recordLog(
          changedBy,
          "add",
          "calf",
          "Calf for cow " # cowId.toText(),
          "Added calf",
        );
        id;
      };
    };
  };

  public query ({ caller }) func getCalvesByCow(cowId : Nat) : async [Calf] {
    calvesArr.filter(func(calf) { calf.cowId == cowId });
  };

  public shared ({ caller }) func deleteCalf(id : Nat, changedBy : Text) : async () {
    let calfExists = calvesArr.find(func(calf) { calf.id == id }) != null;
    if (not calfExists) {
      Runtime.trap("Calf with id " # id.toText() # " not found");
    };
    calvesArr := calvesArr.filter(func(calf) { calf.id != id });
    recordLog(
      changedBy,
      "delete",
      "calf",
      id.toText(),
      "Deleted calf id: " # id.toText(),
    );
  };

  // ================================= DONATIONS =================================
  public shared ({ caller }) func addDonation(
    donorName : Text,
    amount : Float,
    message : Text,
    purpose : Text,
    changedBy : Text,
  ) : async Nat {
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
    donationsArr := donationsArr.concat([donation]);
    recordLog(
      changedBy,
      "add",
      "donation",
      donorName,
      "Donation by: " # donorName,
    );
    id;
  };

  public query ({ caller }) func getDonation(id : Nat) : async Donation {
    switch (donationsArr.find(func(donation) { donation.id == id })) {
      case (null) { Runtime.trap("Donation not found") };
      case (?donation) { donation };
    };
  };

  public query ({ caller }) func getAllDonations() : async [Donation] {
    donationsArr;
  };

  // ================================= HEALTH RECORDS =================================
  public shared ({ caller }) func addHealthRecord(
    cowId : Nat,
    notes : Text,
    status : Text,
    vetName : Text,
    changedBy : Text,
  ) : async Nat {
    let cowExists = cowsArr.find(func(cow) { cow.id == cowId }) != null;
    if (not cowExists) {
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
    healthRecordsArr := healthRecordsArr.concat([record]);
    recordLog(
      changedBy,
      "add",
      "health",
      "Cow " # cowId.toText(),
      "Added health record",
    );
    id;
  };

  public query ({ caller }) func getHealthRecord(id : Nat) : async HealthRecord {
    switch (healthRecordsArr.find(func(record) { record.id == id })) {
      case (null) { Runtime.trap("Health record not found") };
      case (?record) { record };
    };
  };

  public query ({ caller }) func getHealthRecordsByCow(cowId : Nat) : async [HealthRecord] {
    healthRecordsArr.filter(func(record) { record.cowId == cowId });
  };

  // ================================= ANNOUNCEMENTS =================================
  public shared ({ caller }) func addAnnouncement(
    title : Text,
    titleHindi : Text,
    content : Text,
    contentHindi : Text,
    isActive : Bool,
    changedBy : Text,
  ) : async Nat {
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
    announcementsArr := announcementsArr.concat([announcement]);
    recordLog(changedBy, "add", "announcement", title, "Added announcement");
    id;
  };

  public query ({ caller }) func getAnnouncement(id : Nat) : async Announcement {
    switch (announcementsArr.find(func(announcement) { announcement.id == id })) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?announcement) { announcement };
    };
  };

  public query ({ caller }) func getActiveAnnouncements() : async [Announcement] {
    announcementsArr.filter(func(a) { a.isActive });
  };

  // ================================= MILK RECORDS =================================
  public shared ({ caller }) func addMilkRecord(
    cowId : Nat,
    cowName : Text,
    date : Text,
    morning : Float,
    evening : Float,
    changedBy : Text,
  ) : async Nat {
    let id = milkRecordIdCounter;
    milkRecordIdCounter += 1;
    let record : MilkRecord = {
      id;
      cowId;
      cowName;
      date;
      morning;
      evening;
      addedDate = Time.now();
      changedBy;
    };
    milkRecordsArr := milkRecordsArr.concat([record]);
    recordLog(
      changedBy,
      "add",
      "milk",
      cowName,
      "Added milk record for " # cowName,
    );
    id;
  };

  public query ({ caller }) func getMilkRecordsByDate(date : Text) : async [MilkRecord] {
    milkRecordsArr.filter(func(record) { record.date == date });
  };

  public query ({ caller }) func getAllMilkRecords() : async [MilkRecord] {
    milkRecordsArr;
  };

  public shared ({ caller }) func deleteMilkRecord(id : Nat, changedBy : Text) : async () {
    let milkRecordExists = milkRecordsArr.find(func(record) { record.id == id }) != null;
    if (not milkRecordExists) {
      Runtime.trap("Milk record not found");
    };
    milkRecordsArr := milkRecordsArr.filter(func(record) { record.id != id });
    recordLog(
      changedBy,
      "delete",
      "milk",
      id.toText(),
      "Deleted milk record",
    );
  };

  public query ({ caller }) func getTodayMilkRecords() : async [MilkRecord] {
    milkRecordsArr.sort(compareByDate);
  };

  // ================================= PROFILE =================================

  public query ({ caller }) func getProfile() : async GaushaalaProfile {
    gaushaalaProfile;
  };

  public shared ({ caller }) func updateProfile(
    name : Text,
    nameHindi : Text,
    description : Text,
    descriptionHindi : Text,
    phone : Text,
    address : Text,
    logoBase64 : Text,
    changedBy : Text,
  ) : async () {
    gaushaalaProfile := {
      name;
      nameHindi;
      description;
      descriptionHindi;
      phone;
      address;
      logoBase64;
    };
    recordLog(changedBy, "edit", "profile", name, "Updated gaushala profile");
  };

  // ================================= FEED STOCK =================================

  public shared ({ caller }) func updateFeedStock(
    feedType : Text,
    totalStock : Float, // Overwrites total stock value
    dailyPerCow : Float,
    updatedBy : Text,
  ) : async () {
    let stockId = if (feedType == "wet") { 1 } else if (feedType == "dry") { 2 } else { Runtime.trap("Invalid feed type") };

    let updatedStock : FeedStock = {
      id = stockId;
      feedType;
      totalStock;
      dailyPerCow;
      lastUpdated = Time.now();
      updatedBy;
    };
    let filteredStocks = feedStocksArr.filter(func(stock) { stock.id != stockId });
    feedStocksArr := filteredStocks.concat([updatedStock]);
    recordLog(updatedBy, "update_feed_stock", "feed_stock", feedType, "Feed stock updated");
  };

  public shared ({ caller }) func addFeedStockQuantity(
    feedType : Text,
    quantity : Float,
    notes : Text,
    recordedBy : Text,
  ) : async () {
    let stockId = if (feedType == "wet") { 1 } else if (feedType == "dry") { 2 } else { Runtime.trap("Invalid feed type") };
    let currentStock : FeedStock = switch (feedStocksArr.find(func(stock) { stock.id == stockId })) {
      case (null) { {
        id = stockId;
        feedType;
        totalStock = 0.0;
        dailyPerCow = 0.0;
        lastUpdated = Time.now();
        updatedBy = recordedBy;
      } };
      case (?stock) { stock };
    };
    let updatedStock : FeedStock = {
      id = stockId;
      feedType;
      totalStock = currentStock.totalStock + quantity;
      dailyPerCow = currentStock.dailyPerCow;
      lastUpdated = Time.now();
      updatedBy = recordedBy;
    };
    let filteredStocks = feedStocksArr.filter(func(stock) { stock.id != stockId });
    feedStocksArr := filteredStocks.concat([updatedStock]);

    let historyId = feedHistoryIdCounter;
    feedHistoryIdCounter += 1;
    let newHistory : FeedHistory = {
      id = historyId;
      feedType;
      action = "add";
      quantity;
      notes;
      date = Time.now();
      recordedBy;
    };
    feedHistoriesArr := feedHistoriesArr.concat([newHistory]);
    recordLog(recordedBy, "add_feed_stock", "feed_stock", feedType, "Added " # quantity.toText() # " kg");
  };

  public shared ({ caller }) func recordFeedConsumption(
    feedType : Text,
    quantity : Float,
    notes : Text,
    recordedBy : Text,
  ) : async () {
    if (quantity <= 0.0) { Runtime.trap("Quantity must be positive") };
    let stockId = if (feedType == "wet") { 1 } else if (feedType == "dry") { 2 } else { Runtime.trap("Invalid feed type") };
    let currentStock = switch (feedStocksArr.find(func(stock) { stock.id == stockId })) {
      case (null) { Runtime.trap("Feed stock not found") };
      case (?stock) { stock };
    };
    if (currentStock.totalStock < quantity) { Runtime.trap("Insufficient stock") };
    let updatedStock : FeedStock = {
      id = stockId;
      feedType;
      totalStock = currentStock.totalStock - quantity;
      dailyPerCow = currentStock.dailyPerCow;
      lastUpdated = Time.now();
      updatedBy = recordedBy;
    };
    let filteredStocks = feedStocksArr.filter(func(stock) { stock.id != stockId });
    feedStocksArr := filteredStocks.concat([updatedStock]);

    let historyId = feedHistoryIdCounter;
    feedHistoryIdCounter += 1;
    let newHistory : FeedHistory = {
      id = historyId;
      feedType;
      action = "consume";
      quantity;
      notes;
      date = Time.now();
      recordedBy;
    };
    feedHistoriesArr := feedHistoriesArr.concat([newHistory]);
    recordLog(recordedBy, "consume_feed", "feed_stock", feedType, "Consumed " # quantity.toText() # " kg");
  };

  public query ({ caller }) func getFeedStocks() : async [FeedStock] {
    feedStocksArr;
  };

  public query ({ caller }) func getFeedHistory() : async [FeedHistory] {
    feedHistoriesArr.sort(compareFeedHistoryByDate);
  };
};
