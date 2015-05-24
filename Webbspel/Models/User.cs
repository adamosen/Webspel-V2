//Author: Ludwig Fingal
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Webbspel.Helpers;

namespace Webbspel.Models
{
    public class User
    {
        [Required(ErrorMessage="Please provide username", AllowEmptyStrings=false)]
        [Display(Name = "Username")]
        public string UserName { get; set; }

        [Required(ErrorMessage="Please provide password", AllowEmptyStrings=false)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }


        [Display(Name = "Remember me")]
        public bool Remember { get; set; }

        public bool IsValid(string _username, string _password)
        {
            using (var cn = new SqlConnection(@"Data Source=(LocalDB)\v11.0;AttachDbFilename='|DataDirectory|\LoginDB.mdf';Integrated Security=True"))
            {
                string _sql = @"Select [Username] FROM [dbo].[System_Users] " +
                    @"WHERE [Username] = @u AND [Password] = @p";
                var cmd = new SqlCommand(_sql, cn);
                cmd.Parameters
                    .Add(new SqlParameter("@u", SqlDbType.NVarChar))
                    .Value = _username;
                cmd.Parameters
                    .Add(new SqlParameter("@p", SqlDbType.NVarChar))
                    .Value = Helpers.SHA1.Encode(_password);
                cn.Open();
                var reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    reader.Dispose();
                    cmd.Dispose();
                    return true;
                }
                else
                {
                    reader.Dispose();
                    cmd.Dispose();
                    return false;
                }

            }
        }


    }
}