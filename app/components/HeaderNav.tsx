import { Link } from "@remix-run/react";

import Logo from "~/assets/Logo.svg";
import LinkedIn from "~/assets/Linkedin.svg";
import Github from "~/assets/Github.svg";

const HeaderNav = () => {
  return (
    <div className="p-2 flex justify-between">
      <Link to="https://pioneerdev.ai">
        <img src={Logo} width={24} height={24} alt="PioneerDevAI_Logo" />
      </Link>

      <div className="flex gap-2">
        <Link to="https://linkedin.com/pioneerdevai">
          <img
            src={LinkedIn}
            width={24}
            height={24}
            alt="PioneerDevAI_Linkedin"
          />
        </Link>

        <Link to="https://github.com/pioneerdevai">
          <img src={Github} width={24} height={24} alt="PioneerDevAI_Github" />
        </Link>
      </div>
    </div>
  );
};

export default HeaderNav;
