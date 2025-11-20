"use client"

import { Fragment, useState } from 'react'
import { InstantSearchNext } from 'react-instantsearch-nextjs'
import { SearchBox, Hits, Highlight, Configure } from 'react-instantsearch'
import { client } from '@/lib/client'
import LocalizedClientLink from '@/components/molecules/LocalizedLink/LocalizedLink'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME || 'products'

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                <InstantSearchNext searchClient={client} indexName={indexName}>
                  <Configure hitsPerPage={5} filters="status:published" />

                  <div className="p-4 border-b">
                    <SearchBox
                      placeholder="Search products..."
                      classNames={{
                        root: 'relative',
                        form: 'relative',
                        input: 'w-full px-4 py-3 text-lg border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-primary',
                        submit: 'absolute right-3 top-1/2 -translate-y-1/2',
                        reset: 'absolute right-12 top-1/2 -translate-y-1/2',
                        submitIcon: 'w-5 h-5 text-neutral-500',
                        resetIcon: 'w-5 h-5 text-neutral-500',
                      }}
                    />
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    <Hits hitComponent={Hit} />
                  </div>

                  <div className="p-4 bg-neutral-50 text-sm text-neutral-600 flex items-center justify-between border-t">
                    <div className="flex items-center gap-4">
                      <span>
                        <kbd className="px-2 py-1 bg-white border rounded">↑↓</kbd> Navigate
                      </span>
                      <span>
                        <kbd className="px-2 py-1 bg-white border rounded">Enter</kbd> Select
                      </span>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-3 py-1 bg-white border rounded hover:bg-neutral-100"
                    >
                      <kbd>Esc</kbd> Close
                    </button>
                  </div>
                </InstantSearchNext>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

function Hit({ hit }: { hit: any }) {
  const firstImage = hit.images?.[0] || hit.thumbnail

  return (
    <LocalizedClientLink
      href={`/products/${hit.handle}`}
      className="flex items-center gap-4 p-4 hover:bg-neutral-50 border-b transition-colors"
    >
      <div className="relative w-16 h-16 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={hit.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-neutral-900 truncate">
          <Highlight attribute="title" hit={hit} />
        </h3>
        {hit.subtitle && (
          <p className="text-sm text-neutral-600 truncate">
            <Highlight attribute="subtitle" hit={hit} />
          </p>
        )}
        {hit.min_price && (
          <p className="text-sm font-medium text-primary mt-1">
            From ${(hit.min_price / 100).toFixed(2)}
          </p>
        )}
      </div>
    </LocalizedClientLink>
  )
}
