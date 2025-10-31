import { 
    MdSpaceDashboard,
    MdInventory,
    MdCategory 
  } from "react-icons/md";

export const navigationLinks = [
    {
        path:'/',
        name:'home'
    },
    {
        path:'/shop',
        name:'shop'
    },
    {
        path:'/about',
        name:'about'
    },
    {
        path:'/faq',
        name:'faq'
    },
    {
        path:'/contact',
        name:'contact'
    },
  
]


export const adminNavLinks = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: MdSpaceDashboard
    },
    {
      path: '/admin/products',
      name: 'Products',
      icon:  MdInventory 
    },
    {
      path: '/admin/categories',
      name: 'Categories',
      icon:  MdCategory
    },
    {
      path: '/admin/regions',
      name: 'Brands',
      icon:  MdCategory
    },
  ];


export const Navlanguages = [
  {
    value:"en",
    label:"ENGLISH"
  },
  {
    value:"es",
    label:"ESPANYOL"
  }
]