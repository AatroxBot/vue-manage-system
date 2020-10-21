<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-lx-add"
                    class="handle-del mr10"
                    @click="addNewUser"
                >新增用户</el-button>
                <!-- <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>-->
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
                <el-table-column prop="UserName" label="用户名"></el-table-column>
                <!-- <el-table-column label="账户余额">
                    <template slot-scope="scope">{{scope.row.SuperUser}}</template>
                </el-table-column>-->
                <!-- <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.thumb"
                            :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
                </el-table-column>-->
                <!-- <el-table-column prop="address" label="地址"></el-table-column> -->
                <el-table-column label="管理员" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.SuperUser===true?'success':'false'"
                        >{{scope.row.SuperUser===true?'是':'否'}}</el-tag>
                    </template>
                </el-table-column>

                <!-- <el-table-column prop="date" label="注册时间"></el-table-column> -->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.UserName"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.Password" :type="passw">
                        <i slot="suffix" :class="icon" @click="showPass"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="管理员">
                    <el-checkbox v-model="form.SuperUser"></el-checkbox>
                </el-form-item>
                <el-form-item label="权限">
                    <!-- <div v-for="item in permissionData" :key="item.PermissionGroupID">
                        <el-tag>{{item.PermissioGroupName}}</el-tag>
                        <el-checkbox-group v-model="selectPermission">
                            <el-checkbox
                                v-for="j in item.PermissionGroupList"
                                :label="j.PermissionID"
                                :key="j.PermissionID"
                                name="type"
                            >{{j.PermissionName}}</el-checkbox>
                        </el-checkbox-group>
                    </div>-->
                    <div v-for="item in form.UserPermissions" :key="item.PermissionGroupID">
                        <el-tag>{{item.PermissionGroupID=='0'?'用户设置':item.PermissionGroupID=='1'?'基础设置':'任务设置'}}</el-tag>
                        <br />
                        <el-radio-group v-model="item.PermissionType">
                            <el-radio :label="0">无权限</el-radio>
                            <el-radio :label="1">只读权限</el-radio>
                            <el-radio :label="2">读写权限</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData, fetchPermission, getUserList, UpdateUser, DelUser, AddUser } from '../../api/index';

export default {
    name: 'usertable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            permissionData: [],
            selectPermission: ['301'],
            title: '',
            //用于改变Input类型
            passw: 'password',
            //用于更换Input中的图标
            icon: 'el-input__icon el-icon-view'
        };
    },
    created() {
        this.getData();
        this.getAllPermission();
    },
    methods: {
        // 获取数据
        getData() {
            //获取table表单基础用户信息
            // fetchData(this.query).then((res) => {
            //     console.log(res);
            //     this.tableData = res.list;
            //     this.pageTotal = res.pageTotal || 50;
            // });
            //根据登录用户权限获取所有用户信息
            getUserList().then((res) => {
                console.log(11);
                console.log(res);
                this.tableData = res;
            });
        },
        getAllPermission() {
            //获取全部权限信息
            fetchPermission().then((res) => {
                console.log(res);
                this.permissionData = res.PermissionList;
            });
            //获取用户权限信息
            //this.selectPermission = localStorage.getItem('ms_userPermission');
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    DelUser(this.row.UserCode).then((res) => {
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            this.title = '编辑';
            //this.handlePermissionChecked(row.Permission);

            console.log(row);
            console.log(row.UserPermissions);
            // for (let i = 0; i < row.UserPermissions.length; i++) {
            //     this.$set(this.selectPermission, i, row.UserPermissions[i]);
            // }
            // console.log(selectPermission);
        },
        // 保存新增/编辑
        saveEdit() {
            //调用接口保存
            console.log(this.form);
            if (this.idx == -1) {
                //新增
                UpdateUser(this.form).then((res) => {
                    console.log(res);
                    this.$message.success(`新增成功`);
                    this.getData();
                });
            } else {
                //编辑
                UpdateUser(this.form).then((res) => {
                    console.log(res);
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.$set(this.tableData, this.idx, this.form);
                });
            }
            this.editVisible = false;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        //新增用户
        addNewUser() {
            this.idx = -1;
            this.form = {};
            this.editVisible = true;
            this.title = '新增';
        },
        //密码的隐藏和显示
        showPass() {
            //点击图标是密码隐藏或显示
            if (this.passw == 'text') {
                this.passw = 'password';
                //更换图标
                this.icon = 'el-input__icon el-icon-view';
            } else {
                this.passw = 'text';
                this.icon = 'el-input__icon el-icon-loading';
            }
        }
        //根据权限id选中对应的checkbox
        //handlePermissionChecked(val) {
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
