import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    // cleaned up css
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    // cleaned up
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    // cleaned up.
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
  },
  {
    // cleaned up.
    path: "register",
    loadChildren: () =>
      import("./register/register.module").then((m) => m.RegisterPageModule),
  },
  {
    // cleaned up
    path: "verifyemail",
    loadChildren: () =>
      import("./verifyemail/verifyemail.module").then(
        (m) => m.VerifyemailPageModule
      ),
  },
  {
    // cleaned up
    path: "welcome",
    loadChildren: () =>
      import("./welcome/welcome.module").then((m) => m.WelcomePageModule),
  },

  {
    // cleaned up
    path: "createaccount",
    loadChildren: () =>
      import("./createaccount/createaccount.module").then(
        (m) => m.CreateaccountPageModule
      ),
  },

  { // cleaned up
    path: "mywallet",
    loadChildren: () =>
      import("./mywallet/mywallet.module").then((m) => m.MywalletPageModule),
  },

  {
    // cleaned up
    path: "contact",
    loadChildren: () =>
      import("./contact/contact.module").then((m) => m.ContactPageModule),
  },
  { // cleaned up0
    path: "newsfeed",
    loadChildren: () =>
      import("./newsfeed/newsfeed.module").then((m) => m.NewsfeedPageModule),
  },
  {
    // cleaned up
    path: "newsdetail",
    loadChildren: () =>
      import("./newsdetail/newsdetail.module").then(
        (m) => m.NewsdetailPageModule
      ),
  },
  {
    // cleaned up
    path: "creditcard/:card_type",
    loadChildren: () =>
      import("./creditcard/creditcard.module").then(
        (m) => m.CreditcardPageModule
      ),
  },

  {
    // unreachabl and incomplete
    path: "sendmoney",
    loadChildren: () =>
      import("./sendmoney/sendmoney.module").then((m) => m.SendmoneyPageModule),
  },
  {
    // unreachable and incomplete
    path: "sendmoney2/:number/:cardid",
    loadChildren: () =>
      import("./sendmoney2/sendmoney2.module").then(
        (m) => m.Sendmoney2PageModule
      ),
  },
  {
    // unreachable and incomplete
    path: "sendmoney3",
    loadChildren: () =>
      import("./sendmoney3/sendmoney3.module").then(
        (m) => m.Sendmoney3PageModule
      ),
  },

  {
    // cleaned up, but still looks bad
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfilePageModule),
  },
  {
    // cleaned up, seems incomplete
    path: "cardkyc",
    loadChildren: () =>
      import("./cardkyc/cardkyc.module").then((m) => m.CardkycPageModule),
  },
  {
    // cleaned up, but seems inaccessible
    path: "userlist/:number/:cardid",
    loadChildren: () =>
      import("./userlist/userlist.module").then((m) => m.UserlistPageModule),
  },
  {
    // same module as userlist
    path: "userlistforsend/:number",
    loadChildren: () =>
      import("./userlist/userlist.module").then((m) => m.UserlistPageModule),
  },

  {
    // cleaned up
    path: "listing",
    loadChildren: () =>
      import("./listing/listing.module").then((m) => m.ListingPageModule),
  },
  {
    // cleaned up
    path: "editprofile",
    loadChildren: () =>
      import("./editprofile/editprofile.module").then(
        (m) => m.EditprofilePageModule
      ),
  },

  {
    // cleaned up
    path: "walletnew",
    loadChildren: () =>
      import("./walletnew/walletnew.module").then((m) => m.WalletnewPageModule),
  },

  {
    // cleaned up
    path: "termcondition",
    loadChildren: () =>
      import("./termcondition/termcondition.module").then(
        (m) => m.TermconditionPageModule
      ),
  },
  {
    // cleaned up
    path: "privacypolicy",
    loadChildren: () =>
      import("./privacypolicy/privacypolicy.module").then(
        (m) => m.PrivacypolicyPageModule
      ),
  },
  {
    // unreachable?  I can't find any page referring to the 'pending' route
    path: "pending",
    loadChildren: () =>
      import("./pending/pending.module").then((m) => m.PendingPageModule),
  },
  {
    // cleaned up
    path: "forgotpassword",
    loadChildren: () =>
      import("./forgotpassword/forgotpassword.module").then(
        (m) => m.ForgotpasswordPageModule
      ),
  },
  {
    // unreachable?  I heard this was a partially implemented feature.
    path: "plaid",
    loadChildren: () =>
      import("./plaid/plaid.module").then((m) => m.PlaidPageModule),
  },
  {
    // unreachable?
    //
    // It's referenced in app.component.ts's deepLinkSetup function, but that
    // function is never called.

    path: "stripereturn",
    loadChildren: () =>
      import("./stripereturn/stripereturn.module").then(
        (m) => m.StripereturnPageModule
      ),
  },
  {
    // cleaned up
    path: "financial-settings",
    loadChildren: () =>
      import("./financial-settings/financial-settings.module").then(
        (m) => m.FinancialSettingsPageModule
      ),
  },
  { // cleaned up.  pretty sure it's Unreachable.
    path: "edit-card",
    loadChildren: () =>
      import("./edit-card/edit-card.module").then((m) => m.EditCardPageModule),
  },
  {
    // cleaned up.
    path: "about-us",
    loadChildren: () =>
      import("./about-us/about-us.module").then((m) => m.AboutUsPageModule),
  },
  {
    // cleaned up, but link frrom app.component.html is commented out.
    path: "transaction-history",
    loadChildren: () =>
      import("./transaction-history/transaction-history.module").then(
        (m) => m.TransactionHistoryPageModule
      ),
  },
  {
    // cleaned up, link in selected-activity.page is commented out.
    path: "add-funds",
    loadChildren: () =>
      import("./add-funds/add-funds.module").then((m) => m.AddFundsPageModule),
  },
  {
    // cleaned up, inaccessible
    path: "search-action",
    loadChildren: () =>
      import("./modals/search-action/search-action.module").then(
        (m) => m.SearchActionPageModule
      ),
  },
  {
    // cleaned up
    path: "logout",
    loadChildren: () =>
      import("./modals/logout/logout.module").then((m) => m.LogoutPageModule),
  },
  {
    // cleaned up
    path: "contact-confirmation-popup",
    loadChildren: () =>
      import(
        "./modals/contact-confirmation-popup/contact-confirmation-popup.module"
      ).then((m) => m.ContactConfirmationPopupPageModule),
  },
  { // cleaned up
    path: "setting",
    loadChildren: () =>
      import("./setting/setting.module").then((m) => m.SettingPageModule),
  },
  {
    // cleaned up
    path: "home2",
    loadChildren: () =>
      import("./home2/home2.module").then((m) => m.Home2PageModule),
  },
  {
    // cleaned up
    path: "add-cash",
    loadChildren: () =>
      import("./add-cash/add-cash.module").then((m) => m.AddCashPageModule),
  },
  {
    // cleaned up
    path: "add-cash-two",
    loadChildren: () =>
      import("./add-cash-two/add-cash-two.module").then(
        (m) => m.AddCashTwoPageModule
      ),
  },
  {
    // cleaned up
    path: "cash-out",
    loadChildren: () =>
      import("./cash-out/cash-out.module").then((m) => m.CashOutPageModule),
  },
  {
    // cleaned up
    path: "activity",
    loadChildren: () =>
      import("./activity/activity.module").then((m) => m.ActivityPageModule),
  },
  {
    // cleaned up
    path: "selected-activity",
    loadChildren: () =>
      import("./selected-activity/selected-activity.module").then(
        (m) => m.SelectedActivityPageModule
      ),
  },
  {
    // cleaned up
    path: "friend-access/:user_id",
    loadChildren: () =>
      import("./friend-access/friend-access.module").then(
        (m) => m.FriendAccessPageModule
      ),
  },
  {
    // cleaned up
    // friend-access.page.html references 'accessModal()'
    // accessModal() in friend-access.page.ts is the sole reference to FriendAccessModalPage
    // But the call to accessModal() is commented out in friend-access.page.html
    path: "friend-access-modal",
    loadChildren: () =>
      import("./modals/friend-access-modal/friend-access-modal.module").then(
        (m) => m.FriendAccessModalPageModule
      ),
  },
  {
    // cleaned up
    path: "add-name",
    loadChildren: () =>
      import("./add-name/add-name.module").then((m) => m.AddNamePageModule),
  },
  {
    // cleaned up
    path: "cash-marke",
    loadChildren: () =>
      import("./cash-marke/cash-marke.module").then(
        (m) => m.CashMarkePageModule
      ),
  },
  {
    // cleaned up
    path: "add-zipcode",
    loadChildren: () =>
      import("./add-zipcode/add-zipcode.module").then(
        (m) => m.AddZipcodePageModule
      ),
  },
  {
    // cleaned up
    path: "stripe-kyc",
    loadChildren: () =>
      import("./stripe-kyc/stripe-kyc.module").then(
        (m) => m.StripeKycPageModule
      ),
  },
  {
    // don't know how to clean this up.  No nicer way to do numeric keypad input in ionic.
    path: "numberpad",
    loadChildren: () =>
      import("./pages/numberpad/numberpad.module").then(
        (m) => m.NumberpadPageModule
      ),
  },

  {
    // cleaned up
    path: "confirmsend",
    loadChildren: () =>
      import("./modals/confirmsend/confirmsend.module").then(
        (m) => m.ConfirmsendPageModule
      ),
  },
  {
    // cleaned up
    path: "requestpay",
    loadChildren: () =>
      import("./pages/requestpay/requestpay.module").then(
        (m) => m.RequestpayPageModule
      ),
  },
  {
    // cleaned up
    path: "addbank",
    loadChildren: () =>
      import("./addbank/addbank.module").then((m) => m.AddbankPageModule),
  },
  {
    // cleaned up
    path: "notifications",
    loadChildren: () =>
      import("./notifications/notifications.module").then(
        (m) => m.NotificationsPageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
