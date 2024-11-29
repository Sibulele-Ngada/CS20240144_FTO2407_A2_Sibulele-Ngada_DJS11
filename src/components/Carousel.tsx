import { Preview } from "../types";
import "@coreui/coreui/dist/css/coreui.min.css";
import {
  CCarousel,
  CCarouselItem,
  CImage,
  CCarouselCaption,
} from "@coreui/react";

type CarouselProp = {
  elements: Preview[];
};

export default function RecommendedCarousel(props: CarouselProp) {
  const carouselItems = props.elements.map((item) => {
    return (
      <CCarouselItem interval={5000}>
        <CImage
          className="d-block w-35 ml-50 carousel-img"
          src={item.image}
          alt={item.title}
        />
        <CCarouselCaption className="d-none d-md-block">
          <h5>{item.title}</h5>
        </CCarouselCaption>
      </CCarouselItem>
    );
  });

  const randomNumber1 = Math.floor(Math.random() * carouselItems.length);
  const randomNumber2 = Math.floor(Math.random() * carouselItems.length);
  const randomNumber3 = Math.floor(Math.random() * carouselItems.length);

  return (
    <CCarousel interval={5000} pause="hover" controls indicators>
      {[
        carouselItems[randomNumber1],
        carouselItems[randomNumber2],
        carouselItems[randomNumber3],
      ]}
    </CCarousel>
  );
}
