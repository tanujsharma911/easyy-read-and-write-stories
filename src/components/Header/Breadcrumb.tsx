import { Link } from "react-router"
import { useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react/jsx-runtime";

export function BreadcrumbNav() {
  const location = useLocation();
  const path = location.pathname;
  const segments = path.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>

        {segments.length > 0 && <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="text-gray-600">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>}

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const to = `/${segments.slice(0, index + 1).join("/")}`;

          return (
            <Fragment key={to}>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-gray-600 capitalize">
                    {segment.replace(/[-0-9]/g, " ")}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to} className="text-gray-600 capitalize">
                      {segment.replace(/[-0-9]/g, " ")}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}

        {/* <BreadcrumbSeparator className="text-gray-400" />

        <BreadcrumbItem>
          <BreadcrumbPage className="text-gray-600">Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem> */}

      </BreadcrumbList>
    </Breadcrumb>
  )
}
