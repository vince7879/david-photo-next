import { Button } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

const DashboardPage = () => {
  return (
    <div>
      <Button>
        <Link href="/photos/new">New Photo</Link>
      </Button>
    </div>
  );
};

export default DashboardPage;
