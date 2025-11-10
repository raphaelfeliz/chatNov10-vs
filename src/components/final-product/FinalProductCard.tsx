/* *file-summary*
PATH: src/components/final-product/FinalProductCard.tsx

PURPOSE: Displays the final selected product in a 2:1 horizontal card layout.

SUMMARY: Shows the product image on the left and, on the right, product specs as purple chips, a 'Ver Produto' button (links to product URL), and a 'Negociar no WhatsApp' button (links to WhatsApp with product info).

PROPS:
- product: Product (from productDatabase)

*/

import { Product } from '../../core/engine/productDatabase';

interface FinalProductCardProps {
  product: Product;
}



function buildWhatsAppLink(product: Product) {
  const msg = encodeURIComponent(
    `Olá! Gostaria de negociar sobre este produto: ${product.slug}\nLink: https://fabricadoaluminio.com.br/produto/${product.slug}`
  );
  return `https://wa.me/?text=${msg}`;
}

export default function FinalProductCard({ product }: FinalProductCardProps) {
  return (
  <div className="w-full max-w-3xl aspect-[2/1] bg-white rounded-xl shadow-lg flex overflow-hidden border-4 border-[#8f5fff]">
      {/* Left: Image */}
  <div className="flex-1 flex items-center justify-center bg-white">
        <img
          src={product.image}
          alt={product.slug}
          className="max-h-[90%] max-w-[90%] object-contain"
        />
      </div>
      {/* Right: Details */}
  <div className="flex-1 flex flex-col justify-center items-center gap-6 p-6 bg-[#101e29]">
        {/* Product specs as purple chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-[#8f5fff]">
            {product.categoria}
          </span>
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-[#8f5fff]">
            {product.sistema}
          </span>
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-[#8f5fff]">
            {product.material}
          </span>
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-[#8f5fff]">
            {product.folhasNumber} folhas
          </span>
          {product.persiana === 'sim' && (
            <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-[#8f5fff]">
              persiana {product.persianaMotorizada || 'manual'}
            </span>
          )}
        </div>
        {/* Buttons stacked vertically */}
        <div className="flex flex-col w-full gap-4">
          <a
            href={`https://fabricadoaluminio.com.br/produto/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center text-center py-2 rounded-lg font-bold text-white bg-[#8f5fff] hover:bg-[#7a4be3]"
          >
            Ver Produto
          </a>
          <a
            href={buildWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center text-center py-2 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600"
          >
            Negociar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
