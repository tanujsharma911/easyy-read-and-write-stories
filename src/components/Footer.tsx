import { Separator } from "@/components/ui/separator";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router";

const footerLinks = [
  {
    title: "Home",
    to: "",
  },
  {
    title: "Write Article",
    to: "/write-article",
  },
  {
    title: "Account",
    to: "/account",
  },
];

const Footer = () => {
  return (
    <div className="flex flex-col">
      <footer className="border-t">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="py-12 flex flex-col justify-start items-center">
            <p className="scroll-m-20 text-xl font-semibold tracking-tight">
              Easyy - Read & Write Stories
            </p>

            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footerLinks.map(({ title, to }) => (
                <li key={title}>
                  <Link
                    to={to}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}

            <div className="flex items-center ml-auto gap-5 text-muted-foreground">
              <Link
                to="https://github.com/tanujsharma911"
                target="_blank"
                aria-label="Visit Tanuj Sharma's GitHub profile"
              >
                <FaGithub />
              </Link>
              <Link
                to="https://www.linkedin.com/in/tanujsharma911/"
                target="_blank"
                aria-label="Visit Tanuj Sharma's LinkedIn profile"
              >
                <FaLinkedinIn />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
