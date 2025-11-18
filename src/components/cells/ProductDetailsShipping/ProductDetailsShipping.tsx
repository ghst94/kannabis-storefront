import { ProductPageAccordion } from '@/components/molecules';

export const ProductDetailsShipping = () => {
  return (
    <ProductPageAccordion
      heading='Same-Day Delivery & Returns'
      defaultOpen={false}
    >
      <div className='product-details'>
        <ul>
          <li>
            Free same-day delivery on all orders within our
            service area. Orders placed before 2 PM are
            typically delivered the same day.
          </li>
          <li>
            We offer a 30-day return policy. If you are not
            completely satisfied with your purchase, you can
            return the product for a full refund or exchange,
            provided it is in its original condition and
            packaging.
          </li>
        </ul>
      </div>
    </ProductPageAccordion>
  );
};
