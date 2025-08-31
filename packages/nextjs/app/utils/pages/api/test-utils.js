// /pages/api/test.js
import { createUser, getUserByWallet, createProposal, getProposalsByInventor } from '../../utils/utils';

export default async function handler(req, res) {
  try {
    const newUser = await createUser({ 
      wallet_address: '0x1234abcd', 
      profile_name: 'Juan Perez', 
      user_type: 'inventor' 
    });

    const user = await getUserByWallet('0x1234abcd');

    const proposal = await createProposal({
      inventor_id: user[0].id,
      title: 'App de IA',
      encrypted_abstract_cid: 'QmEncryptedAbstractCID',
      status: 'draft',
      patent_nft_token_id: null
    });

    const proposals = await getProposalsByInventor(user[0].id);

    res.status(200).json({ newUser, user, proposal, proposals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
