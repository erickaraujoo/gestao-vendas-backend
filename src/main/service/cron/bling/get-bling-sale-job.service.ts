/* eslint-disable no-await-in-loop */
/* eslint-disable max-statements */
/* eslint-disable max-depth */
import { AppDataSource, emptyArray, firstIndex, totalMinutes, totalSeconds } from '@main/config';
import {
  BlingCronLogRepository,
  BlingProductRepository,
  BlingSaleRepository,
  UserBlingTokenRepository,
  UserRepository
} from '@main/repository';
import { addDays, addHours } from 'date-fns';
import { errorLogger } from '@main/utils';
import { getBlingSaleList, getOneBlingSale, refreshBlingToken } from '@main/service/bling';

export const getBlingSaleJob = async (): Promise<void> => {
  await AppDataSource.transaction(async (tx) => {
    const userRepository = new UserRepository(tx);
    const userList = await userRepository.findValidated();
    const userBlingTokenRepository = new UserBlingTokenRepository(tx);
    const blingCronLogRepository = new BlingCronLogRepository(tx);
    const blingProductRepository = new BlingProductRepository(tx);
    const blingSaleRepository = new BlingSaleRepository(tx);
    const limit = 100;

    const blingCronLog = await blingCronLogRepository.findLast();

    if (blingCronLog === null) return;

    const blingCronLogDate = blingCronLog.createdAt.toISOString().split('T')[firstIndex];

    for await (const {
      ID,
      blingClientID,
      blingClientSecret,
      userType,
      userBlingTokenList: [{ blingAccessToken, blingAccessTokenExpiresAt, blingRefreshToken }]
    } of userList)
      try {
        const currentTimestamp = new Date().getTime();
        const accessTokenExpiresAtTimestamp = blingAccessTokenExpiresAt.getTime();

        if (accessTokenExpiresAtTimestamp >= currentTimestamp) {
          let page = 1;
          let nextPage = true;
          const accr = 1;

          while (nextPage) {
            const { data: saleList } = await getBlingSaleList({
              accessToken: blingAccessToken,
              initialDate: blingCronLogDate,
              limit,
              page
            });

            if (saleList.length > emptyArray) {
              for await (const sale of saleList) {
                const saleDetails = await getOneBlingSale({
                  accessToken: blingAccessToken,
                  id: sale.id
                });

                for await (const item of saleDetails.data.itens) {
                  const blingProduct = await blingProductRepository.findOneByBlingCodeAndUser({
                    blingCode: item.codigo,
                    user: { ID }
                  });

                  if (blingProduct !== null) {
                    const referencedBlingProduct =
                      await blingProductRepository.findOneByBlingCodeAndNotUserAndNotUserType({
                        blingCode: item.codigo,
                        user: { ID, userType: { ID: userType.ID } }
                      });

                    if (referencedBlingProduct !== null)
                      await blingSaleRepository.insert({
                        blingAmount: item.valor,
                        blingProduct: { ID: blingProduct.ID },
                        blingSaleID: String(item.id),
                        blingStoreID: String(saleDetails.data.loja.id),
                        referencedBlingProduct: { ID: referencedBlingProduct.ID },
                        referencedUser: { ID: referencedBlingProduct.user.ID },
                        user: { ID: blingProduct.user.ID }
                      });

                    // TODO: Enviar notificação aqui
                  }
                }
              }

              if (saleList.length === limit) page += accr;
              else nextPage = false;
            } else nextPage = false;
          }
        } else {
          const clientAPP = btoa(`${blingClientID}:${blingClientSecret}`);

          const output = await refreshBlingToken({
            clientAPP,
            grantType: 'refresh_token',
            refreshToken: blingRefreshToken
          });

          const newAccessTokenExpiresAt = addHours(
            new Date(),
            output.tokenExpiresIn / totalSeconds / totalMinutes
          );

          const refreshTokenDeadline = 30;
          const newRefreshTokenExpiresAt = addDays(new Date(), refreshTokenDeadline);

          await userBlingTokenRepository.deleteByUser({ user: { ID } });

          await userBlingTokenRepository.insert({
            blingAccessToken: output.accessToken,
            blingAccessTokenExpiresAt: newAccessTokenExpiresAt,
            blingRefreshToken: output.refreshToken,
            blingRefreshTokenExpiresAt: newRefreshTokenExpiresAt,
            user: { ID }
          });
        }

        await blingCronLogRepository.insert();
      } catch (error) {
        errorLogger(error);
      }
  });
};
