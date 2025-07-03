import MenuWrapper from "@/components/product/MenuWrapper";
import axios from "axios";
import React from "react";

const index = ({ categoryList, productList }) => {
  // console.log("productList", productList);

  return (
    <div className="pt-20">
      <MenuWrapper categoryList={categoryList} productList={productList} />
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const category = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`
    );
    const product = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products`
    );

    return {
      props: {
        categoryList: category.data ? category.data : [],
        productList: product.data ? product.data : [],
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      props: {
        categoryList: [],
        productList: [],
      },
    };
  }
};

export default index;
