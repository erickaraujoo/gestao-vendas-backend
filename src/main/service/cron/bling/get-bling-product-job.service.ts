/* eslint-disable no-await-in-loop */
/* eslint-disable max-statements */
/* eslint-disable max-depth */
import { AppDataSource, emptyArray, totalMinutes, totalSeconds } from '@main/config';
import {
  BlingCronLogRepository,
  BlingProductRepository,
  UserBlingTokenRepository,
  UserRepository
} from '@main/repository';
import { addDays, addHours } from 'date-fns';
import { errorLogger } from '@main/utils';
import { getBlingProductList, refreshBlingToken } from '@main/service/bling';

export const getBlingProductJob = async (): Promise<void> => {
  await AppDataSource.transaction(async (tx) => {
    const blingProductRepository = new BlingProductRepository(tx);
    const userRepository = new UserRepository(tx);
    const userList = await userRepository.findValidated();
    const userBlingTokenRepository = new UserBlingTokenRepository(tx);
    const blingCronLogRepository = new BlingCronLogRepository(tx);
    const limit = 100;

    for await (const {
      ID,
      blingClientID,
      blingClientSecret,
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
            const { data: productList } = await getBlingProductList({
              accessToken: blingAccessToken,
              limit,
              page
            });

            const formattedProducts: Array<{
              blingCode: string;
              blingName: string;
              blingPrice: number;
              blingProductID: string;
              user: { ID: number };
            }> = [];

            for await (const product of productList)
              formattedProducts.push({
                blingCode: product.codigo,
                blingName: product.nome,
                blingPrice: product.preco,
                blingProductID: product.id,
                user: { ID }
              });

            if (productList.length > emptyArray) {
              const hasBlingProduct = await blingProductRepository.findOneByOrNull({
                blingCode: productList[productList.length - accr].codigo,
                user: { ID }
              });

              if (hasBlingProduct === null) page += accr;
              else nextPage = false;

              await blingProductRepository.insert(formattedProducts);
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
