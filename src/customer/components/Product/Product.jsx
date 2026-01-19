"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import ProductCard from "./ProductCard";
import { singleFilters, filters, sortOptions } from "./FilterData";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProduct } from "../../State/Products/Action";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const param = useParams();

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const colorValue = searchParams.get("colors");
  const sizeValue = searchParams.get("size");
  const priceValue = searchParams.get("price");
  const discount = searchParams.get("discount");
  const sortValue = searchParams.get("sort");
  const pageNumber = Number(searchParams.get("page")) || 1;
  const stock = searchParams.get("stock");
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);

  // Handle checkbox filter (multiple selection)
  const handleCheckboxFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValue = searchParams.get(sectionId);
    let filterArray = filterValue ? filterValue.split(",") : [];

    if (filterArray.includes(value)) {
      filterArray = filterArray.filter((item) => item !== value);
    } else {
      filterArray.push(value);
    }

    if (filterArray.length === 0) {
      searchParams.delete(sectionId);
    } else {
      searchParams.set(sectionId, filterArray.join(","));
    }

    const query = searchParams.toString();
    navigate({ search: query ? `?${query}` : "" });
  };

  // Handle radio filter (single selection)
  const handleRadioFilterChange = (e, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(sectionId, e.target.value);
    const query = searchParams.toString();
    navigate({ search: query ? `?${query}` : "" });
  };

  // Handle sort change
  const handleSortChange = (sortValue) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", sortValue);
    const query = searchParams.toString();
    navigate({ search: query ? `?${query}` : "" });
  };

  // Handle pagination
  const handlePaginationChange = (e, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `${query}` });
  };

  // Clear all filters
  const clearAllFilters = () => {
    navigate({ search: "" });
  };

  // Check if a checkbox is checked
  const isChecked = (sectionId, value) => {
    const filterValue = searchParams.get(sectionId);
    if (!filterValue) return false;
    return filterValue.split(",").includes(value);
  };

  useEffect(() => {
    const [minPrice, maxPrice] =
      priceValue === null ? [0, 0] : priceValue.split("-").map(Number);
    
    // Sử dụng lavelThree nếu có, nếu không thì dùng lavelTwo (cấp 2)
    const categoryName = param.lavelThree || param.lavelTwo || "";
    
    const data = {
      category: categoryName,
      colors: colorValue || "",
      size: sizeValue || "",
      minPrice,
      maxPrice,
      minDiscount: discount || 0,
      sort: sortValue || "price_low",
      pageNumber: pageNumber - 1,
      pageSize: 15,
      stock: stock || "",
    };

    dispatch(findProduct(data));
  }, [
    param.lavelThree,
    param.lavelTwo,
    colorValue,
    sizeValue,
    priceValue,
    discount,
    sortValue,
    pageNumber,
    stock,
  ]);

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Bộ lọc</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Đóng menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Mobile Filters */}
              <form className="mt-4 border-t border-gray-200">
                {/* Checkbox Filters */}
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <Checkbox
                              checked={isChecked(section.id, option.value)}
                              onChange={() =>
                                handleCheckboxFilter(option.value, section.id)
                              }
                              size="small"
                              sx={{
                                color: "#9333ea",
                                "&.Mui-checked": { color: "#9333ea" },
                              }}
                            />
                            <label className="ml-2 text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}

                {/* Radio Filters */}
                {singleFilters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <FormControl>
                        <RadioGroup
                          value={searchParams.get(section.id) || ""}
                          onChange={(e) =>
                            handleRadioFilterChange(e, section.id)
                          }
                        >
                          {section.options.map((option) => (
                            <FormControlLabel
                              key={option.value}
                              value={option.value}
                              control={
                                <Radio
                                  size="small"
                                  sx={{
                                    color: "#9333ea",
                                    "&.Mui-checked": { color: "#9333ea" },
                                  }}
                                />
                              }
                              label={
                                <span className="text-sm text-gray-600">
                                  {option.label}
                                </span>
                              }
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Sản phẩm
            </h1>

            <div className="flex items-center">
              {/* Sort Menu */}
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sắp xếp
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value}>
                        <button
                          onClick={() => handleSortChange(option.value)}
                          className={classNames(
                            sortValue === option.value
                              ? "font-medium text-gray-900 bg-gray-100"
                              : "text-gray-500",
                            "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          )}
                        >
                          {option.name}
                        </button>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">Xem dạng lưới</span>
                <Squares2X2Icon aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Bộ lọc</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Sản phẩm
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
              {/* Desktop Filters */}
              <div className="hidden lg:block">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FilterListIcon className="size-5" />
                    Bộ lọc
                  </h2>
                  {(colorValue || sizeValue || priceValue || discount) && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>

                {/* Checkbox Filters (Color, Size) */}
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6"
                    defaultOpen
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon
                                aria-hidden="true"
                                className="size-5 group-data-open:hidden"
                              />
                              <MinusIcon
                                aria-hidden="true"
                                className="size-5 group-not-data-open:hidden"
                              />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                          <div className="space-y-3">
                            {section.options.map((option) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <Checkbox
                                  checked={isChecked(section.id, option.value)}
                                  onChange={() =>
                                    handleCheckboxFilter(
                                      option.value,
                                      section.id
                                    )
                                  }
                                  size="small"
                                  sx={{
                                    color: "#9333ea",
                                    "&.Mui-checked": { color: "#9333ea" },
                                    padding: "4px",
                                  }}
                                />
                                <label className="ml-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                ))}

                {/* Radio Filters (Price, Discount) */}
                {singleFilters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6"
                    defaultOpen
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon
                                aria-hidden="true"
                                className="size-5 group-data-open:hidden"
                              />
                              <MinusIcon
                                aria-hidden="true"
                                className="size-5 group-not-data-open:hidden"
                              />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                          <FormControl>
                            <RadioGroup
                              value={searchParams.get(section.id) || ""}
                              onChange={(e) =>
                                handleRadioFilterChange(e, section.id)
                              }
                            >
                              {section.options.map((option) => (
                                <FormControlLabel
                                  key={option.value}
                                  value={option.value}
                                  control={
                                    <Radio
                                      size="small"
                                      sx={{
                                        color: "#9333ea",
                                        "&.Mui-checked": { color: "#9333ea" },
                                        padding: "4px",
                                      }}
                                    />
                                  }
                                  label={
                                    <span className="text-sm text-gray-600">
                                      {option.label}
                                    </span>
                                  }
                                  sx={{ marginLeft: 0 }}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>

              {/* Product grid */}
              <div className="lg:col-span-4 w-full">
                <div className="flex flex-wrap justify-start bg-white pt-5 pb-2 gap-4">
                  {products.loading ? (
                    <div className="w-full text-center py-20">
                      <CircularProgress />
                      <p className="text-gray-500 text-lg mt-4">
                        Đang tải sản phẩm...
                      </p>
                    </div>
                  ) : (() => {
                    // Handle both array and Page object format
                    const productList = Array.isArray(products.products) 
                      ? products.products 
                      : products.products?.content || [];
                    
                    return productList.length > 0 ? (
                      productList.map((item) => (
                        <ProductCard key={item.id} product={item} />
                      ))
                    ) : (
                      <div className="w-full text-center py-20">
                        <p className="text-gray-500 text-lg">
                          Không tìm thấy sản phẩm nào
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </section>

          {/* Pagination */}
          {(() => {
            const totalPages = Array.isArray(products.products) 
              ? 1 
              : products.products?.totalPages || 1;
            
            return totalPages > 1 && (
              <div className="w-full px-4 py-3 flex justify-center">
                <Pagination
                  page={pageNumber}
                  count={totalPages}
                  color="secondary"
                  onChange={handlePaginationChange}
                  showFirstButton
                  showLastButton
                />
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
}
