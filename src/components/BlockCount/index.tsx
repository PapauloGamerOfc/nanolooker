import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Skeleton, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { refreshActionDelay } from "components/utils";
import { BlockCountContext } from "api/contexts/BlockCount";
import LoadingStatistic from "components/LoadingStatistic";

const POLL_INTERVAL = 1000 * 30;

const BlockCount: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const {
    count,
    unchecked,
    cemented,
    getBlockCount,
    isLoading: isBlockCountLoading,
  } = React.useContext(BlockCountContext);

  const refreshBlockCount = async () => {
    setIsLoading(true);
    await refreshActionDelay(getBlockCount);
    setIsLoading(false);
  };

  React.useEffect(() => {
    let interval: number = window.setInterval(() => {
      try {
        getBlockCount();
      } catch (_e) {
        clearInterval(interval);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!isBlockCountLoading) {
      setIsInitialLoading(false);
    }
  }, [isBlockCountLoading]);

  const opacity = isLoading ? 0.5 : 1;

  return (
    <Card
      size="small"
      title={t("common.blocks")}
      extra={
        <Tooltip title={t("pages.status.reload")}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            size="small"
            onClick={refreshBlockCount}
            loading={isLoading}
          />
        </Tooltip>
      }
    >
      <Skeleton active loading={!count}>
        <LoadingStatistic
          title={t("pages.status.count")}
          value={count}
          isLoading={isInitialLoading}
          valueStyle={{ opacity }}
        />
        <LoadingStatistic
          isLoading={isInitialLoading}
          title={t("pages.status.unchecked")}
          tooltip={t("tooltips.unchecked")}
          value={unchecked}
          valueStyle={{ opacity }}
        />
        <LoadingStatistic
          title={t("pages.status.cemented")}
          tooltip={t("tooltips.cemented")}
          value={cemented}
          isLoading={isInitialLoading}
          valueStyle={{ opacity }}
        />
      </Skeleton>
    </Card>
  );
};

export default BlockCount;
