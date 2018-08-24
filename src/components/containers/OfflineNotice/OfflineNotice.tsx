import * as React from "react";
import { MdPortableWifiOff } from "react-icons/lib/md";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";
import { connect } from "react-redux";

import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  isOnline: boolean;
}

interface IProps extends IStoreProps {
  intl: InjectedIntl;
}

const OfflineNotice: React.SFC<IProps> = ({ isOnline }) =>
  isOnline ? null : (
    <div className="OfflineNotice">
      <MdPortableWifiOff />
      <p>
        <FormattedMessage id="CONTENT_UNAVAILABLE_OFFLINE" />
      </p>
    </div>
  );

const mapStateToProps = (state: any) => ({
  isOnline: selectors.isOnline(state)
});

export default injectIntl<any>(
  connect<IStoreProps>(mapStateToProps)(OfflineNotice)
);
