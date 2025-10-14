import { StarIcon } from "@heroicons/react/20/solid";
import { Box, Button, Grid, LinearProgress, Rating } from "@mui/material";
import ProductReviewCard from "./ProductReviewCard";
import { useEffect, useState } from "react";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProductById } from "../../State/Products/Action";
import { addItemToCart } from "../../State/Cart/Action";

const StarRating = ({ value, size = "medium", readOnly = false }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 !== 0;

  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  for (let i = 1; i <= 5; i++) {
    let starClass = `${sizeClasses[size]} `;

    if (i <= fullStars) {
      starClass += "text-yellow-400 fill-current";
    } else if (i === fullStars + 1 && hasHalfStar) {
      starClass += "text-yellow-400 fill-current opacity-50";
    } else {
      starClass += "text-gray-300 fill-current";
    }

    stars.push(
      <svg key={i} className={starClass} viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }

  return <div className="flex">{stars}</div>;

};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState("");
  const ratingData = [
    { label: "Excellent", value: 40, color: "#22c55e" },
    { label: "Very Good", value: 30, color: "#16a34a" },
    { label: "Good", value: 30, color: "#eab308" },
    { label: "Average", value: 20, color: "#f59e0b" },
    { label: "Poor", value: 10, color: "#ef4444" },
  ];
  const navigate = useNavigate();
  const handAddToCart = () => {
    const data = {productId: params.productId, size: selectedSize.name}
    console.log("data",data);
    dispatch(addItemToCart(data))
    navigate("/cart");
  };
  const dispatch = useDispatch();

  const params = useParams();

  //useSelector : Lấy dữ liệu (state) từ Redux Store đưa vào component React
  //Tham số store (hay state) ở đây chính là toàn bộ Redux Store.
  //Bạn đang truy cập toàn bộ state gốc mà Redux đang quản lý.
  const { products } = useSelector((store) => store);
  const data = { productId: params.productId };
  console.log(data, "data");

  useEffect(() => {
    const data = { productId: params.productId };
    dispatch(findProductById(data));
  }, [params.productId]);

  return (
    <div className="bg-white lg:px-20">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {/* {products.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    fill="currentColor"
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))} */}
            {/* <li className="text-sm">
              <a
                href={products.href}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {products.name}
              </a>
            </li> */}
          </ol>
        </nav>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10">
          {/* Image gallery */}
          <div className="flex flex-col items-center ">
            <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]">
              <img
                alt={""}
                src={products.product?.imageUrl}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {/* <div className="flex flex-wrap space-x-5 justify-center">
              {products.images.map((item) => (
                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-w-[5rem] max-h-[5rem] mt-4">
                  <img
                    alt={item.alt}
                    src={item.src}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </div> */}
          </div>
          {/* Product info */}
          <div className="lg:col-span-1 maxt-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24">
            <div className="lg:col-span-2 ">
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                {products.product?.brand}
              </h1>
              <h1 className="text-lg lg:text-xl text-gray-900 opacity-60 pt-1">
                {products.product?.title}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900 mt-6">
                <p className="font-semibold">
                  {products.product?.discountPrice}
                </p>
                <p className="opacity-50 line-through">
                  {products.product?.price}
                </p>
                <p className="text-green-600 font-semibold">
                  {products.product?.discountPersent}% off
                </p>
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <div className="flex items-center space-x-3">
                  <Rating
                    name="read-only"
                    value={5.5}
                    readOnly
                    sx={{ cursor: "pointer" }}
                  />
                  <p className="opacity-50 text-sm">1000 Ratings</p>
                  <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    3870 Reviews
                  </p>
                </div>
              </div>

              <form className="mt-10">
                {/* Sizes */}
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  </div>

                  <fieldset aria-label="Choose a size" className="mt-4">
                    <div className="grid grid-cols-4 gap-3">
                      {products.product?.sizes?.map((size) => (
                        <label
                          aria-label={size.name}
                          className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-[:checked]:border-indigo-600 has-[:disabled]:border-gray-400 has-[:checked]:bg-indigo-600 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-600"
                        >
                          <input
                            defaultValue={size.id}
                            defaultChecked={size === products.sizes[2]}
                            name="size"
                            type="radio"
                            disabled={!size.inStock}
                            className="absolute inset-0 appearance-none focus:outline focus:outline-0 disabled:cursor-not-allowed cursor-pointer rounded-md"
                          />
                          <span className="text-sm font-medium uppercase text-gray-900 group-has-[:checked]:text-white">
                            {size.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <Button
                  onClick={handAddToCart}
                  variant="contained"
                  sx={{
                    px: "2rem",
                    py: "0.8rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    textTransform: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(145,85,253,0.4)",
                    background:
                      "linear-gradient(90deg, #9155fd 0%, #6d28d9 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #7c3aed 0%, #5b21b6 100%)",
                      boxShadow: "0 6px 16px rgba(124,58,237,0.5)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
              </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    {products.description}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">
                  Highlights
                </h3>

                {/* <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    {products.highlights.map((highlight) => (
                      <li key={highlight} className="text-gray-400">
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div> */}
              </div>

              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{products.details}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* rating and reviews */}
        <section className="mx-auto p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Recent Review & Rating
          </h1>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Reviews Section */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Customer Reviews
                  </h2>
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map((item) => (
                      <ProductReviewCard key={item} review={item} />
                    ))}
                  </div>
                </div>

                {/* Ratings Section */}
                <div className="w-full lg:w-96">
                  <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Product Ratings
                    </h2>

                    <div className="flex items-center space-x-4 mb-8">
                      <StarRating value={4.6} size="large" readOnly />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">4.6</p>
                        <p className="text-sm text-gray-500">10,000 Ratings</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {ratingData.map((rating, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-20 text-sm font-medium text-gray-700 text-left">
                            {rating.label}
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500 ease-out hover:opacity-80"
                                style={{
                                  width: `${rating.value}%`,
                                  backgroundColor: rating.color,
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-12 text-sm text-gray-500 text-right font-medium">
                            {rating.value}%
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional stats */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            85%
                          </p>
                          <p className="text-xs text-gray-500">Recommended</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            4.2k
                          </p>
                          <p className="text-xs text-gray-500">Reviews</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* similer products */}
        <section className="pt-10">
          <h1 className="py-5 text-xl font-bold">Similer products</h1>
          <div className="flex flex-wrap space-y-5">
            {products.product?.map((item) => (
              <HomeSectionCard product={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
