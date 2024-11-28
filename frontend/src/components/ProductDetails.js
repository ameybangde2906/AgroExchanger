import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styled from "styled-components";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { formatDateOfBirth } from "../utils/date/date";
import { Divider } from "@mui/material";
import { CurrencyRupeeOutlined, ErrorOutline } from "@mui/icons-material";
import StarRating from "../utils/starRating";
import BuyNowDialog from "../dialogs/BuyNowDialog";
import CounterOfferDialog from "../dialogs/CounterOfferDialog";


// Styled container for layout alignment
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 80%;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  @media (max-width: 1000px) {
    width: 100%;
  }
  @media (max-width: 650px) {
    width: 100%;
  }
`;

const DetailsContainer = styled.div`
  flex: 1;
  display: flex;
  background-color: #FAFAFA;
  flex-direction: column;
  padding: 30px 3%;
  border-radius: 10px;
  margin-right: 30px;
  @media (max-width: 768px) {
    margin-right: 0px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #333;
`;

const Rating = styled.span`
  display: inline-block;
  color: #333;
  font-weight: bold;
  padding: 3px 5px;
  border-radius: 5px;
  font-size: 14px;
`;

const ProductDetails = () => {
    const { id: productId } = useParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: product, error, isLoading, refetch } = useQuery({
        queryKey: ["productData", productId],
        queryFn: async () => {
            const response = await fetch(
                `http://localhost:5000/api/orders/product/${productId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch product data");
            }
            return response.json();
        },
    });

    useEffect(() => {
        if (productId) {
            refetch();
        }
    }, [productId, refetch]);

    const handleNext = () => {
        if (product?.productImage?.length) {
            setCurrentIndex((prev) => (prev + 1) % product.productImage.length);
        }
    };

    const handlePrev = () => {
        if (product?.productImage?.length) {
            setCurrentIndex(
                (prev) => (prev - 1 + product.productImage.length) % product.productImage.length
            );
        }
    };

    const isMyProduct = authUser?._id === product?.seller._id

    if (isLoading) {
        return <div className="text-center text-lg mt-10">Loading product details...</div>;
    }

    if (error) {
        return (
            <div className="text-center text-lg text-red-600 mt-10">
                Error: {error.message}
            </div>
        );
    }

    return (
        <Container>
            {/* Image Carousel */}
            <ImageContainer>
                {product?.productImage?.length > 0 && (
                    <>
                        <ProductImage
                            src={product.productImage[currentIndex]}
                            alt={product.productName}
                        />
                        {/* Navigation Arrows */}
                        {product.productImage.length > 1 && (
                            <>
                                <IconButton
                                    onClick={handlePrev}
                                    style={{
                                        position: "absolute",
                                        left: "20px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        color: "white",
                                    }}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                                <IconButton
                                    onClick={handleNext}
                                    style={{
                                        position: "absolute",
                                        right: "20px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        color: "white",
                                    }}
                                >
                                    <ArrowForwardIcon />
                                </IconButton>
                            </>
                        )}
                    </>
                )}
            </ImageContainer>

            {/* Product Details */}
            <DetailsContainer>
                <p className="text-blue-400 text-base mb-3">
                    <strong>Crop ID: </strong>#{product?._id}
                </p>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {capitalizeFirstLetter(product?.productName)}
                </h1>
                <p className="text-base text-gray-600 mb-3">
                    <strong>Variety:</strong> {capitalizeFirstLetter(product?.productType)}
                </p>
                <p className="text-base text-gray-600 mb-3">
                    <strong>Speciality:</strong> {capitalizeFirstLetter(product?.speciality)}
                </p>
                <p className="text-base text-gray-600 mb-3">
                    <strong>Available Quantity:</strong> {product?.quantity}{" "}
                    {capitalizeFirstLetter(product?.quantityUnit)}
                </p>
                <p className="text-base text-gray-600 mb-3">
                    <strong>Price:</strong> <CurrencyRupeeOutlined fontSize="inherit" />{product?.price} per{" "}
                    {capitalizeFirstLetter(product?.quantityUnit)}
                </p>
                <p className="text-base text-gray-600 mb-3">
                    <strong>Minimum Allowed Price:</strong> <CurrencyRupeeOutlined fontSize="inherit" />{product?.allowedPriceEntry} per{" "}
                    {capitalizeFirstLetter(product?.quantityUnit)}<p></p>
                </p>
                {/* <p className="text-lg text-green-600 font-bold mb-4">
                    Minimum Allowed Price: <CurrencyRupeeOutlined /> {product?.allowedPriceEntry} per{" "}
                    {capitalizeFirstLetter(product?.quantityUnit)}
                </p> */}
                <p className="text-base text-gray-600 mb-3">
                    <strong>Available On:</strong> {formatDateOfBirth(product?.pickUpDate) || "Not specified"}
                </p>
                <Divider />
                {/* Seller Information */}
                <SectionTitle>About Seller</SectionTitle>
                <p className="text-base text-blue-400 mb-1">
                    <strong>Seller ID:</strong> #{product?.seller?._id}
                </p>
                <p className="text-base text-gray-600 mb-3">
                    <strong>Seller Rating:</strong> <Rating>{<StarRating rating={`${4.5}`} />}</Rating>
                </p>
                <p className="text-base text-gray-600 mb-3">
                    <strong>Seller Location: </strong> {`${product?.address.village} / ${product?.address.district} / ${capitalizeFirstLetter(product?.address.state)} `}
                </p>

                {isMyProduct ?
                    <div className="mt-4 text-red-500 font-bold text-lg">This is your product. You can't buy it !</div>
                    :
                    (<div className="mt-6 space-x-3">
                        <BuyNowDialog product={product} productId={productId} /> <CounterOfferDialog product={product} productId={productId} />
                    </div>)
                }
                <div className="text-[13px] text-gray-500 flex items-center mt-3"><ErrorOutline fontSize="inherit" sx={{marginRight:'3px'}}/> Note: Bidding is subject to the seller's decision and may be sold to the highest bidder.</div>
            </DetailsContainer>
        </Container>
    );
};

export default ProductDetails;
