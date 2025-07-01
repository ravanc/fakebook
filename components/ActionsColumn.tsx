import Image from "next/image";
import Link from "next/link";
import React from "react";

function ActionsColumn() {
  return (
    <div className="pt-3">
      <Link
        href={"/"}
        className="flex flex-row items-center text-lg mt-4 ml-6 w-fit"
      >
        <Image
          src={"/home.svg"}
          width={32}
          height={32}
          alt="icon"
          className="mr-2"
        />
        Home
      </Link>
      <Link
        href={"/friends"}
        className="flex flex-row items-center text-lg mt-4 ml-6 w-fit"
      >
        <Image
          src={"/person.svg"}
          width={32}
          height={32}
          alt="icon"
          className="mr-2"
        />
        Friends
      </Link>

      <Link
        href={"/post"}
        className="flex flex-row items-center text-lg mt-4 ml-6 w-fit"
      >
        <Image
          src={"/post.svg"}
          width={32}
          height={32}
          alt="icon"
          className="mr-2"
        />
        Create Post
      </Link>
    </div>
  );
}

export default ActionsColumn;
