"use client";

import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_NUMBER_SEARCH_PARAMS_KEY } from "@/constants";
import { useCallback } from "react";
import React from 'react'
import { Button } from "./ui/button";

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = useCallback(
    (direction: string) => {
      const nextPageNumber =
        direction === "prev" ? pageNumber - 1 : pageNumber + 1;

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: PAGE_NUMBER_SEARCH_PARAMS_KEY,
        value: nextPageNumber.toString(),
      });

      router.push(newUrl);
    },
    [pageNumber, router, searchParams]
  );

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("prev")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border">
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border">
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
