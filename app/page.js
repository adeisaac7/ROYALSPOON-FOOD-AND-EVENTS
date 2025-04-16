import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import CategoryList from "./_components/CategoryList";
import GlobalApi from "./_utils/GlobalApi";
import BusinessList from "./_components/BusinessList";
import Events from "./_components/event";




export default function Home() {
  return (
    <div>
      {/* <CategoryList/> */}

      <BusinessList/>

      <Events/>
    </div>
  );
}
