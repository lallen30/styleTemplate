import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      //     {
      //       path: 'dashboard',
      //       children: [
      //         {
      //           path: '',
      //           loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      //         },
      //         {
      //           path: 'searchfilter',
      //           loadChildren: () => import('../searchfilter/searchfilter.module').then(m => m.SearchfilterPageModule)
      //         },
      //         {
      //           path: 'upcomingevent',
      //           loadChildren: () => import('../upcoming-event/upcoming-event.module').then(m => m.UpcomingEventPageModule)
      //         },
      //   ]
      // },
      {
        path: "mywallet",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../walletnew/walletnew.module").then(
                (m) => m.WalletnewPageModule
              ),
          },
        ],
      },
      {
        path: "contact",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../contact/contact.module").then(
                (m) => m.ContactPageModule
              ),
          },
        ],
      },
      {
        path: "newsfeed",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../newsfeed/newsfeed.module").then(
                (m) => m.NewsfeedPageModule
              ),
          },
        ],
      },
      {
        path: "profile",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../profile/profile.module").then(
                (m) => m.ProfilePageModule
              ),
          },
        ],
      },
      {
        path: "stripe-kyc",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../stripe-kyc/stripe-kyc.module").then(
                (m) => m.StripeKycPageModule
              ),
          },
        ],
      },
      // {
      //   path: 'booking',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () => import('../booking/booking.module').then(m => m.BookingPageModule)
      //     },
      // ]
      // },
      {
        path: "home2",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../home2/home2.module").then((m) => m.Home2PageModule),
          },
        ],
      },
    ],
  },
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
