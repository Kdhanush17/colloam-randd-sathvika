/**
 * Fix script for existing tenant databases
 * This fixes the foreign key constraint issue on team_members table
 *
 * Usage: node utils/fixTeamMemberFK.js
 */

const { Sequelize } = require('sequelize');
const db = require('../src/models');
const env = require('../config/environment');

const fixExistingTenantDatabases = async () => {
  try {
    console.log('🔍 Finding all tenant databases...');

    // Get all mappings from main DB
    const mappings = await db.database_mappings.findAll({
      where: { status: true }
    });

    if (mappings.length === 0) {
      console.log('✅ No tenant databases to fix');
      return;
    }

    console.log(`📊 Found ${mappings.length} tenant database(s)`);

    for (const mapping of mappings) {
      try {
        console.log(`\n🔧 Fixing: ${mapping.database}...`);

        // Connect to tenant database
        const tenantSequelize = new Sequelize(
          mapping.database,
          mapping.db_username,
          mapping.db_password,
          {
            host: mapping.db_host,
            port: mapping.db_port,
            dialect: 'postgres',
            logging: false,
          }
        );

        await tenantSequelize.authenticate();

        // Drop the problematic constraint
        await tenantSequelize.query(`
          ALTER TABLE team_members
          DROP CONSTRAINT IF EXISTS team_members_user_id_fkey;
        `);

        console.log(`✅ Fixed: ${mapping.database}`);
        await tenantSequelize.close();

      } catch (error) {
        console.error(`❌ Error fixing ${mapping.database}:`, error.message);
      }
    }

    console.log('\n✅ All tenant databases have been processed');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
};

fixExistingTenantDatabases();
