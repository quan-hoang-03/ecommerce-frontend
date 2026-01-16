import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import { navigation } from "./navigationData";
import avt from "../../../assets/img/logo-cosmetic.jpg";
import AuthModel from "../../Auth/AuthModel";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../State/Auth/Action";
import { API_BASE_URL, api } from "../../../config/apiConfig";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [categoriesFromAPI, setCategoriesFromAPI] = useState([]);
  const openUserMenu = Boolean(anchorEl);
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);
  const location = useLocation();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/api/categories/navigation");
        setCategoriesFromAPI(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to static data if API fails
        setCategoriesFromAPI([]);
      }
    };
    fetchCategories();
  }, []);

  // Transform API categories to navigation format
  const buildNavigationFromAPI = () => {
    if (categoriesFromAPI.length === 0) {
      return navigation; // Fallback to static data
    }

    // Group categories by level
    const level1Categories = categoriesFromAPI.filter(cat => cat.level === 1);
    const level2Categories = categoriesFromAPI.filter(cat => cat.level === 2);
    const level3Categories = categoriesFromAPI.filter(cat => cat.level === 3);

    // Build navigation structure
    const apiNavigation = {
      categories: level1Categories.map(cat1 => {
        // Get children (level 2) of this category
        const children = level2Categories.filter(cat2 => 
          cat2.parentCategory?.id === cat1.id
        );

        // Build sections from level 2 categories
        const sections = children.map(cat2 => {
          // Get grandchildren (level 3) of this level 2 category
          const grandchildren = level3Categories.filter(cat3 =>
            cat3.parentCategory?.id === cat2.id
          );

          return {
            id: cat2.name.toLowerCase().replace(/\s+/g, '_'),
            name: cat2.displayName || cat2.name,
            items: grandchildren.map(cat3 => ({
              name: cat3.displayName || cat3.name,
              id: cat3.name.toLowerCase().replace(/\s+/g, '_'),
              href: `/${cat1.name}/${cat2.name}/${cat3.name}`,
            })),
          };
        });

        return {
          id: cat1.name.toLowerCase().replace(/\s+/g, '_'),
          name: cat1.displayName || cat1.name,
          featured: navigation.categories[0]?.featured || [], // Keep featured from static data
          sections: sections.length > 0 ? sections : [
            {
              id: cat1.name.toLowerCase().replace(/\s+/g, '_'),
              name: cat1.displayName || cat1.name,
              items: children.map(cat2 => ({
                name: cat2.displayName || cat2.name,
                id: cat2.name.toLowerCase().replace(/\s+/g, '_'),
                href: `/${cat1.name}/${cat2.name}`,
              })),
            },
          ],
        };
      }),
    };

    // Merge with static navigation for pages and other data
    return {
      ...navigation,
      categories: apiNavigation.categories.length > 0 
        ? apiNavigation.categories 
        : navigation.categories, // Fallback if no API data
    };
  };

  // Use API data if available, otherwise use static data
  const navigationData = categoriesFromAPI.length > 0 
    ? buildNavigationFromAPI() 
    : navigation;


  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = (event) => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setOpenAuthModal(true);
  };
  const handleClose = () => {
    setOpenAuthModal(false);

  };

  const handleCategoryClick = (category, section, item, close) => {
    navigate(`/${category.id}/${section.id}/${item.id}`);
    close();
  };

    useEffect(() => {
      if(jwt){
      dispatch(getUser(jwt));
      }
    },[jwt,auth.jwt])

    // Load avatar - ưu tiên từ server (auth.user.avatar) hơn localStorage
    useEffect(() => {
      if (auth.user) {
        // Ưu tiên avatar từ server trước
        if (auth.user.avatar) {
          // Backend trả về path như /uploads/avatars/filename.jpg
          const avatarUrl = auth.user.avatar.startsWith('http') 
            ? auth.user.avatar 
            : `${API_BASE_URL}${auth.user.avatar}`;
          setAvatarUrl(avatarUrl);
          // Cập nhật localStorage để đồng bộ
          localStorage.setItem(`avatar_${auth.user.id}`, avatarUrl);
        } else {
          // Nếu không có avatar từ server, thử lấy từ localStorage
          const savedAvatar = localStorage.getItem(`avatar_${auth.user.id}`);
          if (savedAvatar) {
            setAvatarUrl(savedAvatar);
          } else {
            setAvatarUrl(null);
          }
        }
      } else {
        setAvatarUrl(null);
      }
    }, [auth.user]);
  
  useEffect(() => {
    if(auth.user){
      handleClose();
    }
    if(location.pathname==="/register" || location.pathname ==="/login" ){
      navigate(-1);
    }
  },[auth.user]);

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate("/");
  }

  return (
    <div className="bg-white pb-10">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigationData?.categories?.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-900",
                              "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium border-none"
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigationData.categories.map((category) => (
                      <Tab.Panel
                        key={category.name}
                        className="space-y-10 px-4 pb-8 pt-10"
                      >
                        <div className="grid grid-cols-2 gap-x-4">
                          {category?.featured?.map((item) => (
                            <div
                              key={item.name}
                              className="group relative text-sm"
                            >
                              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                <img
                                  src={item.imageSrc}
                                  alt={item.imageAlt}
                                  className="object-cover object-center"
                                />
                              </div>
                              <a
                                href={item.href}
                                className="mt-6 block font-medium text-gray-900"
                              >
                                <span
                                  className="absolute inset-0 z-10"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                              <p aria-hidden="true" className="mt-1">
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                        {category?.sections?.map((section) => (
                          <div key={section.name}>
                            <p
                              id={`${category.id}-${section.id}-heading-mobile`}
                              className="font-medium text-gray-900"
                            >
                              {section.name}
                            </p>
                            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                            <ul
                              role="list"
                              aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                              className="mt-6 flex flex-col space-y-6"
                            >
                              {section?.items?.map((item) => (
                                <li key={item.name} className="flow-root">
                                  <p className="-m-2 block p-2 text-gray-500">
                                    {"item.name"}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigationData?.pages?.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a
                        href={page.href}
                        className="-m-2 block p-2 font-medium text-gray-900"
                      >
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <a
                      href="/"
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Sign in
                    </a>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <a href="/" className="-m-2 flex items-center p-2">
                    <img
                      src="https://tailwindui.com/img/flags/flag-canada.svg"
                      alt=""
                      className="block h-auto w-5 flex-shrink-0"
                    />
                    <span className="ml-3 block text-base font-medium text-gray-900">
                      CAD
                    </span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <nav aria-label="Top" className="mx-auto">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center px-11">
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="flex items-center space-x-3 lg:ml-0 ml-4">
                <Link to="/">
                  {" "}
                  <img
                    src={avt}
                    alt=""
                    className="h-12 w-12 rounded-full border border-gray-200 cursor-pointer"
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch z-10">
                <div className="flex h-full space-x-8">
                  {navigationData?.categories?.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open, close }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? "border-indigo-600 text-indigo-600"
                                  : "border-transparent text-gray-700 hover:text-gray-800",
                                "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out focus:outline-none"
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div
                                className="absolute inset-0 top-1/2 bg-white shadow"
                                aria-hidden="true"
                              />

                              <div className="relative bg-white">
                                <div className="mx-auto max-w-7xl px-8">
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                    <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                      {category?.featured?.map((item) => (
                                        <div
                                          key={item.name}
                                          className="group relative text-base sm:text-sm"
                                        >
                                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                            <img
                                              src={item.imageSrc}
                                              alt={item.imageAlt}
                                              className="object-cover object-center"
                                            />
                                          </div>
                                          <a
                                            href={item.href}
                                            className="mt-6 block font-medium text-gray-900"
                                          >
                                            <span
                                              className="absolute inset-0 z-10"
                                              aria-hidden="true"
                                            />
                                            {item.name}
                                          </a>
                                          <p
                                            aria-hidden="true"
                                            className="mt-1"
                                          >
                                            Shop now
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                      {category?.sections?.map((section) => (
                                        <div key={section.name}>
                                          <p
                                            id={`${section.name}-heading`}
                                            className="font-medium text-gray-900"
                                          >
                                            {section.name}
                                          </p>
                                          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                                          <ul
                                            role="list"
                                            aria-labelledby={`${section.name}-heading`}
                                            className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                          >
                                            {section?.items?.map((item) => (
                                              <li
                                                key={item.name}
                                                className="flex"
                                              >
                                                <p
                                                  onClick={() =>
                                                    handleCategoryClick(
                                                      category,
                                                      section,
                                                      item,
                                                      close
                                                    )
                                                  }
                                                  className="cursor-pointer hover:text-gray-800"
                                                >
                                                  {item.name}
                                                </p>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {navigationData?.pages?.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {auth.user?.firstName ? (
                    <div>
                      <Avatar
                        src={avatarUrl}
                        className="text-white"
                        onClick={handleUserClick}
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        sx={{
                          bgcolor: avatarUrl ? "transparent" : deepPurple[500],
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        {!avatarUrl && auth.user?.firstName[0].toUpperCase()}
                      </Avatar>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openUserMenu}
                        onClose={handleCloseUserMenu}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={() => {
                          navigate("/account/profile");
                          handleCloseUserMenu();
                        }}>
                          Thông tin
                        </MenuItem>
                        <MenuItem onClick={() => {
                          navigate("/account/order");
                          handleCloseUserMenu();
                        }}>
                          Giỏ hàng
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                      </Menu>
                    </div>
                  ) : (
                    <Button
                      onClick={handleOpen}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg 
             hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                    >
                      Đăng nhập
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div className="flex items-center lg:ml-6">
                  <p className="m-0 p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>

                    <MagnifyingGlassIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </p>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Button className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {/* {cart.cart?.totalItem} */}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <AuthModel handleClose={handleClose} open={openAuthModal} />
    </div>
  );
}
